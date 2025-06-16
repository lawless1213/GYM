import { useForm } from '@mantine/form';
import { useState, useCallback, useEffect, useMemo } from 'react'; // Додано useMemo
import { useTranslation } from 'react-i18next';
import { Button, ColorInput, Stepper, Group, Stack, Textarea, TextInput, Box } from '@mantine/core';
import { useExerciseCatalog } from '../../hooks/useExerciseCatalog.js';
import { ExerciseCatalogFilters } from '../../components/ExerciseCatalogFilters.jsx';
import { ExerciseCatalogDisplay } from '../../components/ExerciseCatalogDisplay.jsx';
import WorkoutCard from '../../components/WorkoutCard/index.jsx';
import { useMediaQuery } from '@mantine/hooks';
import workoutService from '../../services/workoutService.js';

function Workout({ closeModal, workout = null }) {
  const { t } = useTranslation();
  const [editLoading, setEditLoading] = useState(false);
  
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const isMobile = useMediaQuery('(max-width: 700px)');

  const {
    exercises: allExercises,
    loading,
    filterOptions,
    filters,
    handleFilterChange,
    currentUser
  } = useExerciseCatalog();

  // selectedExercises - це основне джерело правди для вправ, які додаються до тренування
  const [selectedExercises, setSelectedExercises] = useState(workout ? workout.exercises : []);

  const form = useForm({
    initialValues: {
      name: workout ? workout.name : '',
      description: workout ? workout.description : '',
      color: workout ? workout.color : '#fffff'
    },
    validate: {
      name: (val) => (val.trim().length < 3 ? 'Name must be at least 3 characters long' : null),
    },
  });

  const handleSelectExercise = (exerciseId) => {
    setSelectedExercises((prevSelected) => {
      const existingExercise = prevSelected.find(item => item.exerciseId === exerciseId);

      if (existingExercise) {
        return prevSelected.filter(item => item.exerciseId !== exerciseId);
      } else {
        const exerciseFromCatalog = allExercises.find(ex => ex.id === exerciseId);
        
        // Забезпечуємо, що exerciseFromCatalog існує перед доступом до його властивостей
        if (!exerciseFromCatalog) {
            console.warn(`Вправу з id ${exerciseId} не знайдено в каталозі.`);
            return prevSelected; // Повертаємо попередній стан, якщо вправа не знайдена
        }

        const defaultSets = 3;
        const defaultValuePerSet = exerciseFromCatalog.valuePerSet || 0; // Використовуємо 0 як дефолт

        return [
          ...prevSelected,
          {
            exerciseId: exerciseId,
            sets: defaultSets,
            valuePerSet: defaultValuePerSet
          }
        ];
      }
    });
  };

  const handleExerciseOrderChange = useCallback((newOrderedSelectedExercises) => {
    setSelectedExercises(newOrderedSelectedExercises);
  }, []);

  const handleExerciseValuesChange = useCallback((newValuesSelectedExercises) => {
    setSelectedExercises(newValuesSelectedExercises);
  }, []);

  const handleRemoveExerciseFromWorkout = useCallback((updatedExercises) => {
    setSelectedExercises(updatedExercises);
  }, []);
  
  // enrichedExercisesForPreview створюється на основі selectedExercises
  // і використовується для відображення в WorkoutCard. Використовуємо useMemo
  // для мемоізації, щоб уникнути непотрібних перерахунків, якщо selectedExercises
  // та allExercises не змінились.
  const enrichedExercisesForPreview = useMemo(() => {
    return selectedExercises.map(selected => {
      const originalExercise = allExercises.find(ex => ex.id === selected.exerciseId);
      
      if (originalExercise) {
        return {
          exerciseId: selected.exerciseId,
          sets: selected.sets,
          valuePerSet: selected.valuePerSet,
          exercise: originalExercise
        };
      }
      return null;
    }).filter(Boolean);
  }, [selectedExercises, allExercises]); // Залежить від selectedExercises та allExercises

  // calculateCalories тепер є useCallback, щоб уникнути непотрібних перерендерингів
  // і переконатися, що він завжди використовує актуальні enrichedExercisesForPreview
  const calculateCalories = useCallback(() => {
    let value = 0;
    enrichedExercisesForPreview.forEach(exercise => {
      // Перевіряємо наявність exercise та caloriesPerUnit перед розрахунком
      if (exercise.exercise && typeof exercise.exercise.caloriesPerUnit === 'number') {
        const exerciseValue = exercise.sets * exercise.valuePerSet * exercise.exercise.caloriesPerUnit;
        value += exerciseValue;
      } else {
        // Замінено console.warn на більш детальний лог для відлагодження
        // console.warn("Пропущено розрахунок калорій для вправи через відсутність даних:", exercise);
      }
    });
    return value;
  }, [enrichedExercisesForPreview]); // Залежить від enrichedExercisesForPreview

  // Функція для переходу на наступний крок після валідації першого кроку
  const handleSubmitFirstStep = async () => {
    if (!form.validate().hasErrors) {
      nextStep();
    }
  };

  // Фінальна функція відправки форми
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.validate().hasErrors) {
      setEditLoading(true);

      const finalWorkoutData = {
        name: form.values.name,
        description: form.values.description,
        color: form.values.color,
        exercises: selectedExercises,
        calories: calculateCalories()
      };
      console.log("Відправка тренування:", finalWorkoutData);

      const success = finalWorkoutData && await workoutService.createWorkout(finalWorkoutData);

      if (success) {
        closeModal();
      }
      setEditLoading(false);
      
      // Тут буде ваша реальна логіка створення/оновлення тренування.
      // Приклад:
      // setLoading(true);
      // const success = await workoutService.createWorkout(finalWorkoutData);
      // if (success) {
      //   closeModal();
      // }
      // setLoading(false);
    }
  };

  return (
    <>
      {/* onSubmit буде викликатися лише при відправці всієї форми на останньому кроці */}
      <form onSubmit={handleSubmit}>
        <Stepper 
          iconSize={32} 
          active={active} 
          onStepClick={setActive} 
          allowNextStepsSelect={false}
          orientation={isMobile ? 'vertical' : 'horizontal'}
        >
          <Stepper.Step label="Create" description="Create a program">
            <Stack gap="md">
              <Group>
                <TextInput
                  flex="1"
                  placeholder="Workout name"
                  {...form.getInputProps('name')}
                  size="md"
                />
                <ColorInput
                  size="md"
                  w="130px"
                  disallowInput
                  placeholder='Color'
                  // Використовуємо значення з форми напряму, без defaultValue
                  {...form.getInputProps('color')} 
                />
              </Group>
              <Textarea
                  size="md"
                  placeholder="Workout description"
                  h="100%"
                  {...form.getInputProps('description')}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Select" description="Select exercises">
            <Stack gap="md">
              <ExerciseCatalogFilters
                groupExercise={null}
                setGroupExercise={() => {}}
                filters={filters}
                handleFilterChange={handleFilterChange}
                filterOptions={filterOptions}
                currentUser={currentUser}
                showGroupButtons={false}
              />

              <ExerciseCatalogDisplay
                exercises={allExercises}
                loading={loading}
                selectedExercises={selectedExercises}
                handleSelectExercise={handleSelectExercise}
                simpleCards={true}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Confirm" description="Confirm program">
            <Box maw="500px" m="auto">
              <WorkoutCard
                id='previwCard'
                name={form.values.name} // Дані з форми
                color={form.values.color} // Дані з форми
                calories={calculateCalories()} // Обчислюємо на льоту
                exercises={enrichedExercisesForPreview} // Обчислюємо на льоту
                previewMode={true}
                onExerciseOrderChange={handleExerciseOrderChange}
                onExerciseValuesChange={handleExerciseValuesChange}
                onExerciseRemove={handleRemoveExerciseFromWorkout} 
              />
            </Box>
          </Stepper.Step>

          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
        <Group justify="center" mt="xl">
          {active !== 0 && <Button variant="default" onClick={prevStep}>Back</Button>}
          {active === 0 && <Button type="button" onClick={handleSubmitFirstStep}>Next step</Button>}
          {active === 1 && <Button type="button" onClick={nextStep}>Next step</Button>}
          {active === 2 && !!selectedExercises.length && <Button type="submit">
            {
              editLoading ?
              "Loading.." :
              workout ? "Update workout" : "Create workout"
            } </Button>
          }
        </Group>
      </form>
    </>
  );
}

export default Workout;