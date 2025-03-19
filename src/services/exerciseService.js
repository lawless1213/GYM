import { CREATE_EXERCISE, DELETE_EXERCISE, UPDATE_EXERCISE, ADD_TO_BOOKMARKS, REMOVE_FROM_BOOKMARKS } from "../mutations/exercises";
import { GET_EXERCISES, GET_PERSONAL_EXERCISES } from "../queries/exercises";
import { GET_USER } from "../queries/user";
import client from "../providers/apolloClient";
import { getAuth } from "firebase/auth";
import { FirebaseService } from "../firebase/functions";

const exerciseService = {
	// ----------- Create exercise
	async createExercise(exercise, imageFile = null, videoFile = null) {
		const currentUser = getAuth().currentUser;
    if (!currentUser) return false;

		try {
			const [preview, video] = await Promise.all([
				imageFile ? FirebaseService.uploadFile(imageFile, "preview") : '',
				videoFile ? FirebaseService.uploadFile(videoFile, "video") : '',
			]);

			const newExercise = {
        ...exercise,
        preview,
        video,
      };

			const { data } = await client.mutate({
				mutation: CREATE_EXERCISE,
				variables: { input: newExercise },
				update(cache, { data: { createExercise } }) {
					if (createExercise.success) {
						const newExerciseData = createExercise.exercise;
						
						// Оновлюємо кеш для всіх вправ
						try {
							const existingData = cache.readQuery({
								query: GET_EXERCISES,
								variables: { filters: {} }
							});

							cache.writeQuery({
								query: GET_EXERCISES,
								variables: { filters: {} },
								data: {
									getExercises: [...(existingData?.getExercises || []), newExerciseData]
								}
							});
						} catch (e) {
							console.log('Error updating GET_EXERCISES cache:', e);
						}

						// Оновлюємо кеш для персональних вправ
						try {
							const existingPersonalData = cache.readQuery({
								query: GET_PERSONAL_EXERCISES,
								variables: { uid: currentUser.uid }
							});

							cache.writeQuery({
								query: GET_PERSONAL_EXERCISES,
								variables: { uid: currentUser.uid },
								data: {
									getPersonalExercises: [...(existingPersonalData?.getPersonalExercises || []), newExerciseData]
								}
							});
						} catch (e) {
							console.log('Error updating GET_PERSONAL_EXERCISES cache:', e);
						}
					}
				}
			});

      return data?.createExercise || null;
		} catch (error) {
			console.error("Error creating exercise:", error);
      return null;
		}
	},
	// -----------

	// ----------- Delete exercise
  async deleteExercise({ id, author, preview, video }) {
    const currentUser = getAuth().currentUser;
    if (!currentUser || currentUser.uid !== author) return false;

    try {
      const { data } = await client.mutate({
        mutation: DELETE_EXERCISE,
        variables: { input: { id, author, preview, video } },
        update(cache) {
					cache.evict({ id: `Exercise:${id}` });
					cache.gc();
				}
      });

      return data?.deleteExercise || null;
    } catch (error) {
      console.error("Error deleting exercise:", error);
      return null;
    }
  },
	// -----------

	// ----------- Update exercise
  async updateExercise(exercise, image = null, video = null) {
		const currentUser = getAuth().currentUser;
    if (!currentUser) return false;

		try {
			// Якщо є нові файли, завантажуємо їх
			const uploadIfNeeded = async (file, folder) => 
        file && typeof file !== 'string' ? await FirebaseService.uploadFile(file, folder) : file;
    
      const [imageUrl, videoUrl] = await Promise.all([
        uploadIfNeeded(image, "preview"),
        uploadIfNeeded(video, "videos")
      ]);

			// Створюємо об'єкт для оновлення, видаляючи undefined значення
			const updatedExercise = {
				...exercise,
				preview: imageUrl || '',
				video: videoUrl || '',
			};

			const { data } = await client.mutate({
				mutation: UPDATE_EXERCISE,
				variables: { input: updatedExercise },
				update(cache, { data: { updateExercise } }) {
					if (updateExercise.success) {
						const updatedExerciseData = updateExercise.exercise;

						// Оновлюємо кеш для всіх вправ
						try {
							const existingData = cache.readQuery({
								query: GET_EXERCISES,
								variables: { filters: {} }
							});

							if (existingData) {
								cache.writeQuery({
									query: GET_EXERCISES,
									variables: { filters: {} },
									data: {
										getExercises: existingData.getExercises.map(exercise => 
											exercise.id === updatedExerciseData.id ? updatedExerciseData : exercise
										)
									}
								});
							}
						} catch (e) {
							console.log('Error updating GET_EXERCISES cache:', e);
						}

						// Оновлюємо кеш для персональних вправ
						try {
							const existingPersonalData = cache.readQuery({
								query: GET_PERSONAL_EXERCISES,
								variables: { uid: currentUser.uid }
							});

							if (existingPersonalData) {
								cache.writeQuery({
									query: GET_PERSONAL_EXERCISES,
									variables: { uid: currentUser.uid },
									data: {
										getPersonalExercises: existingPersonalData.getPersonalExercises.map(exercise => 
											exercise.id === updatedExerciseData.id ? updatedExerciseData : exercise
										)
									}
								});
							}
						} catch (e) {
							console.log('Error updating GET_PERSONAL_EXERCISES cache:', e);
						}
					}
				}
			});

			return data?.updateExercise || null;
		} catch (error) {
			console.error("Error updating exercise:", error);
			return null;
		}
	},
	// -----------

	// ----------- Toggle bookmark
	async toggleBookmark(exerciseId) {
		const currentUser = getAuth().currentUser;
		if (!currentUser) return false;

		try {
			// Отримуємо поточний стан вправи з кешу
			const cacheData = client.readQuery({
				query: GET_EXERCISES,
				variables: { filters: {} }
			});

			const exercise = cacheData?.getExercises?.find(ex => ex.id === exerciseId);
			if (!exercise) return false;

			const mutation = exercise.isBookmarked ? REMOVE_FROM_BOOKMARKS : ADD_TO_BOOKMARKS;

			const { data } = await client.mutate({
				mutation,
				variables: { exerciseId },
				update(cache, { data: mutationResult }) {
					const updatedExercise = mutationResult[exercise.isBookmarked ? 'removeFromBookmarks' : 'addToBookmarks'].exercise;

					// Оновлюємо кеш для всіх вправ
					try {
						const existingData = cache.readQuery({
							query: GET_EXERCISES,
							variables: { filters: {} }
						});

						if (existingData) {
							cache.writeQuery({
								query: GET_EXERCISES,
								variables: { filters: {} },
								data: {
									getExercises: existingData.getExercises.map(ex => 
										ex.id === updatedExercise.id ? updatedExercise : ex
									)
								}
							});
						}
					} catch (e) {
						console.log('Error updating GET_EXERCISES cache:', e);
					}

					// Оновлюємо кеш для персональних вправ
					try {
						const existingPersonalData = cache.readQuery({
							query: GET_PERSONAL_EXERCISES,
							variables: { uid: currentUser.uid }
						});

						if (existingPersonalData) {
							cache.writeQuery({
								query: GET_PERSONAL_EXERCISES,
								variables: { uid: currentUser.uid },
								data: {
									getPersonalExercises: existingPersonalData.getPersonalExercises.map(ex => 
										ex.id === updatedExercise.id ? updatedExercise : ex
									)
								}
							});
						}
					} catch (e) {
						console.log('Error updating GET_PERSONAL_EXERCISES cache:', e);
					}

					// Оновлюємо кеш для улюблених вправ
					try {
						const existingUserData = cache.readQuery({
							query: GET_USER
						});

						if (existingUserData) {
							const currentBookmarks = existingUserData.getUserData.bookmarks || [];
							const updatedBookmarks = exercise.isBookmarked
								? currentBookmarks.filter(ex => ex.id !== exerciseId)
								: [...currentBookmarks, updatedExercise];

							cache.writeQuery({
								query: GET_USER,
								data: {
									getUserData: {
										...existingUserData.getUserData,
										bookmarks: updatedBookmarks
									}
								}
							});
						}
					} catch (e) {
						console.log('Error updating GET_USER cache:', e);
					}
				}
			});

			return data?.[exercise.isBookmarked ? 'removeFromBookmarks' : 'addToBookmarks'] || null;
		} catch (error) {
			console.error("Error toggling bookmark:", error);
			return null;
		}
	}
	// -----------
};

export default exerciseService;
