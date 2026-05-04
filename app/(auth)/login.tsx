import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { loginSchema, type LoginFormValues } from "@/src/features/auth/schemas/login-schema";
import { useLogin } from "@/src/features/auth/hooks/use-login";
import { screenStyles } from "@/src/theme/styles";

export default function LoginScreen() {
  const mutation = useLogin();
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    router.replace("/(main)/chat");
  });

  return (
    <View style={screenStyles.screen}>
      <View style={screenStyles.card}>
        <Text style={screenStyles.eyebrow}>MIST</Text>
        <Text style={screenStyles.title}>Sign in</Text>
        <Text style={screenStyles.body}>Use your existing backend credentials.</Text>

        <Controller
          control={control}
          name="username"
          render={({ field, fieldState }) => (
            <View style={screenStyles.field}>
              <Text style={screenStyles.label}>Username</Text>
              <TextInput
                autoCapitalize="none"
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                style={screenStyles.input}
                value={field.value}
              />
              {fieldState.error ? <Text style={screenStyles.error}>{fieldState.error.message}</Text> : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <View style={screenStyles.field}>
              <Text style={screenStyles.label}>Password</Text>
              <TextInput
                secureTextEntry
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                style={screenStyles.input}
                value={field.value}
              />
              {fieldState.error ? <Text style={screenStyles.error}>{fieldState.error.message}</Text> : null}
            </View>
          )}
        />

        {mutation.error ? <Text style={screenStyles.error}>{mutation.error.message}</Text> : null}

        <TouchableOpacity disabled={mutation.isPending} onPress={onSubmit} style={screenStyles.button}>
          <Text style={screenStyles.buttonText}>{mutation.isPending ? "Signing in..." : "Sign in"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
