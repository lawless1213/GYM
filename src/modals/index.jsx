import { useModals } from '@mantine/modals';
import { Auth, CreateExercise } from './blocks';

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

export const CreateExerciseModal = ({ context, id, innerProps }) => {
  const modals = useModals();

  const handleClose = () => {
    modals.closeModal(id);
  };

  return (
    <>
      <CreateExercise closeModal={handleClose} />
    </>
  );
};