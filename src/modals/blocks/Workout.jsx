import { useForm } from '@mantine/form';
import { useState, useCallback } from 'react'; // Важливо: useCallback
import { useTranslation } from 'react-i18next';
import { Button, ColorInput, Stepper, Group, Stack, Textarea, TextInput, Box } from '@mantine/core';
import { useExerciseCatalog } from '../../hooks/useExerciseCatalog.js';
import { ExerciseCatalogFilters } from '../../components/ExerciseCatalogFilters.jsx';
import { ExerciseCatalogDisplay } from '../../components/ExerciseCatalogDisplay.jsx';
import WorkoutCard from '../../components/WorkoutCard/index.jsx';



function Workout({ closeModal }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  const [newWorkout, setNewWorkout] = useState({});

  const {
    exercises: allExercises,
    loading,
    filterOptions,
    filters,
    handleFilterChange,
    currentUser
  } = useExerciseCatalog();

  const [selectedExercises, setSelectedExercises] = useState([]);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      color: ''
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
        
        const defaultSets = 3;
        const defaultValuePerSet = exerciseFromCatalog?.valuePerSet || 0;

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

  const enrichedExercisesForPreview = selectedExercises.map(selected => {
    const originalExercise = allExercises.find(ex => ex.id === selected.exerciseId);
    
    if (originalExercise) {
      return {
        exerciseId: selected.exerciseId,
        sets: selected.sets,
        valuePerSet: selected.valuePerSet,
        exercise: originalExercise
      };
    }
    return selected; // або null, якщо ви хочете, щоб вони були відфільтровані
  }).filter(Boolean);

  const handleSubmitFirstStep = async () => {
    if (!form.validate().hasErrors) {
      nextStep();
      setNewWorkout(prevStateWorkout=>({
        ...prevStateWorkout,
        ...form.values
      }))
    }
  };

  const calculateCalories = () => {
    let value = 0;

    enrichedExercisesForPreview.forEach(exercise => {
      const exerciseValue = exercise.sets * exercise.valuePerSet * exercise.exercise.caloriesPerUnit;
      value += exerciseValue;
    })

    return value;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.validate().hasErrors) {
      const newProgram = {
        name: form.values.name,
        description: form.values.description,
        color: form.values.color,
        calories: calculateCalories(),
        exercises: selectedExercises,
      }

      // console.log(newProgram);
      

      // Тут буде ваша реальна логіка створення тренування,
      // де ви відправляєте form.values та selectedExercises на бекенд
      // Приклад:
      // setLoading(true);
      // const success = await workoutService.createWorkout({ ...form.values, exercises: selectedExercises });
      // if (success) {
      //   closeModal();
      // }
      // setLoading(false);
    }
  };

  console.log(newWorkout);
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stepper iconSize={32} active={active} onStepClick={setActive} allowNextStepsSelect={false}>
          <Stepper.Step label="Create" description="Create a program">
            <Stack gap="md">
              <Group>
                <ColorInput
                  w="130px"
                  disallowInput
                  placeholder='Color'
                  {...form.getInputProps('color')}
                />
                <TextInput
                  flex="1"
                  placeholder="Workout name"
                  {...form.getInputProps('name')}
                />
              </Group>
              <Textarea
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
                name={form.values.name}
                color={form.values.color}
                calories={0}
                exercises={enrichedExercisesForPreview}
                previewMode={true}
                onExerciseOrderChange={handleExerciseOrderChange}
              />
            </Box>
          </Stepper.Step>

          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          {active !== 0 && <Button variant="default" onClick={prevStep}>Back</Button>}
          {
            active < 2 ?
              <Button type="button" onClick={active === 0 ? handleSubmitFirstStep : nextStep}>Next step</Button>
              :
              <Button type="submit">
                {"Create workout"}
              </Button>
          }
        </Group>
      </form>
    </>
  )
}

export default Workout;