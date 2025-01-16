import { Anchor, Button, Divider, Group, Paper, PasswordInput, Stack, Text, TextInput} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useAuth } from "../../stores/context/AuthContext";
import { GoogleButton } from '../../components/buttons/GoogleButton';
import { TwitterButton } from '../../components/buttons/TwitterButton';
import { updateProfile } from "firebase/auth";

function Auth() {
  const { signUp, signIn } = useAuth();
  const [type, toggle] = useToggle(['login', 'register']);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },

    validate: {
      email: (val) => (emailRegex.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const signUpHandler = async () => {
    if (form.validate().hasErrors) {
      return;
    }

    const { name, email, password } = form.values;

    try {
      const userCredential = await signUp(email, password); // Реєстрація користувача
      const user = userCredential.user;
  
      await updateProfile(user, {
        displayName: name,
      });
    } catch (error) {
      console.error('Error signing up:', error.message);
      form.setErrors({ email: 'Error creating account. Please try again.' });
    }
  };

  const signInHandler = async () => {
    if (form.validate().hasErrors) {
      return;
    }
    
    const { email, password } = form.values;

    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Error signing in:', error.message);
      form.setErrors({ email: 'Error login. Please try again.' });
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Text size="lg" fw={500}>
        Welcome to GYM, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => { type === 'register' ? signUpHandler() : signInHandler() })}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="user@exampale.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

export default Auth;