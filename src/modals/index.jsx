import { useModals } from '@mantine/modals';
import { Auth, Exercise, Workout, WorkoutExercise } from './blocks';

export const AuthModal = ({ context, id, innerProps }) => {
  const modals = useModals();

  const handleClose = () => {
    modals.closeModal(id);
  };

  return (
    <>
      <Auth closeModal={handleClose} />
    </>
  );
};

export const ExerciseModal = ({ context, id, innerProps }) => {
  const modals = useModals();

  const handleClose = () => {
    modals.closeModal(id);
  };

  return (
    <>
      <Exercise 
        closeModal={handleClose} 
        exercise={innerProps?.exercise}
      />
    </>
  );
};

export const WorkoutModal = ({ context, id, innerProps }) => {
  const modals = useModals();

  const handleClose = () => {
    modals.closeModal(id);
  };

  return (
    <>
      <Workout closeModal={handleClose} />
    </>
  );
};

export const WorkoutExerciseModal = ({ context, id, innerProps }) => {
  const modals = useModals();

  const handleClose = () => {
    modals.closeModal(id);
  };

  return (
    <>
      <WorkoutExercise 
        closeModal={handleClose}
        workout={innerProps?.workout}
      />
    </>
  );
};