import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useLogin } from "@/src/features/auth/hooks/use-login";
import { loginSchema, type LoginFormValues } from "@/src/features/auth/schemas/login-schema";
import { env } from "@/src/lib/env";
import { getSecureItem, setSecureItem, storageKeys } from "@/src/lib/secure-storage";
import { screenStyles } from "@/src/theme/styles";

const ONBOARDING_STEPS = [
  {
    marker: "P",
    eyebrow: "Policy-Aware Agentic Platform",
    title: "Welcome to MIST",
    description: "A clear, trusted workspace for company policy answers, daily guidance, and employee support.",
    accent: "Clarity first",
  },
  {
    marker: "?",
    eyebrow: "Ask Anything",
    title: "Ask anything in plain language",
    description: 'From "What is our WFH policy?" to leave rules and approvals, the AI turns policy search into a conversation.',
    accent: "Instant answers",
  },
  {
    marker: "R",
    eyebrow: "Always Up to Date",
    title: "Grounded in the latest handbook",
    description: "Employees get answers aligned to current company guidance, so policy changes do not get lost in old documents.",
    accent: "Current by design",
  },
] as const;

export default function LoginScreen() {
  const mutation = useLogin();
  const pagerRef = useRef<ScrollView>(null);
  const cardFade = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const screenFade = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const [ready, setReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const authPageIndex = ONBOARDING_STEPS.length;

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    let mounted = true;

    const loadOnboardingState = async () => {
      const seen = await getSecureItem(storageKeys.onboardingSeen);

      if (!mounted) {
        return;
      }

      const initialPage = seen === "true" ? authPageIndex : 0;
      setReady(true);

      requestAnimationFrame(() => {
        pagerRef.current?.scrollTo({ x: width * initialPage, animated: false });
      });
    };

    void loadOnboardingState();

    return () => {
      mounted = false;
    };
  }, [authPageIndex, width]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardFade, screenFade]);

  const markOnboardingSeen = async () => {
    await setSecureItem(storageKeys.onboardingSeen, "true");
  };

  const goToPage = async (pageIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(pageIndex, authPageIndex));

    if (clampedIndex === authPageIndex) {
      await markOnboardingSeen();
    }

    pagerRef.current?.scrollTo({ x: width * clampedIndex, animated: true });
  };

  const onSubmit = handleSubmit(async (values) => {
    await markOnboardingSeen();
    await mutation.mutateAsync(values);
    router.replace("/(main)/chat");
  });

  const animateButton = (toValue: number) => {
    Animated.spring(buttonScale, {
      toValue,
      speed: 22,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const contactSupport = async () => {
    if (!env.supportEmail) {
      return;
    }

    await Linking.openURL(`mailto:${env.supportEmail}`);
  };

  if (!ready) {
    return <View style={screenStyles.authScreen} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
      style={screenStyles.authScreen}
    >
      <Animated.View
        style={[
          screenStyles.authScreen,
          {
            opacity: screenFade,
            transform: [
              {
                translateY: screenFade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={screenStyles.authGlowTop} />
        <View style={screenStyles.authGlowBottom} />
        <View style={screenStyles.authGlowCenter} />

        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={screenStyles.onboardingViewport}
          onMomentumScrollEnd={(event) => {
            const nextPageIndex = Math.round(event.nativeEvent.contentOffset.x / width);

            if (nextPageIndex === authPageIndex) {
              void markOnboardingSeen();
            }
          }}
        >
          {ONBOARDING_STEPS.map((step, index) => (
            <View key={step.title} style={[screenStyles.onboardingPage, { width }]}>
              <View style={screenStyles.onboardingTopRow}>
                <Text style={screenStyles.onboardingTopLabel}>MIST</Text>
                <TouchableOpacity onPress={() => void goToPage(authPageIndex)}>
                  <Text style={screenStyles.onboardingSkip}>Skip</Text>
                </TouchableOpacity>
              </View>

              <View style={screenStyles.onboardingArt}>
                <View style={screenStyles.onboardingArtHalo} />
                <View style={screenStyles.onboardingArtBubble}>
                  <View style={screenStyles.onboardingArtGlow} />
                  <Text style={screenStyles.onboardingIllustration}>{step.marker}</Text>
                  <View style={screenStyles.onboardingArtAccent} />
                  <View style={screenStyles.onboardingArtAccentSoft} />
                </View>
              </View>

              <View style={screenStyles.onboardingCard}>
                <Text style={screenStyles.onboardingEyebrow}>{step.eyebrow}</Text>
                <Text style={screenStyles.onboardingTitle}>{step.title}</Text>
                <Text style={screenStyles.onboardingDescription}>{step.description}</Text>

                <View style={screenStyles.onboardingFeaturePill}>
                  <Text style={screenStyles.onboardingFeaturePillText}>{step.accent}</Text>
                </View>

                <View style={screenStyles.onboardingPreview}>
                  <View style={screenStyles.onboardingPreviewHeader}>
                    <View style={screenStyles.onboardingPreviewAvatar}>
                      <Text style={screenStyles.onboardingPreviewAvatarText}>AI</Text>
                    </View>
                    <View style={screenStyles.onboardingPreviewTitleWrap}>
                      <Text style={screenStyles.onboardingPreviewLabel}>Policy assistant</Text>
                      <Text style={screenStyles.onboardingPreviewMeta}>Fast, cited, current</Text>
                    </View>
                  </View>
                  <Text style={screenStyles.onboardingPreviewQuestion}>
                    {index === 0
                      ? "Where should I start?"
                      : index === 1
                        ? "What's the WFH policy?"
                        : "How do I know this is current?"}
                  </Text>
                  <Text style={screenStyles.onboardingPreviewAnswer}>
                    {index === 0
                      ? "Start with a question. MIST brings policy guidance into a single, simple flow."
                      : index === 1
                        ? "Ask naturally and get concise answers without opening the handbook yourself."
                        : "Answers are aligned to the latest company handbook and policy updates."}
                  </Text>
                </View>

                <View style={screenStyles.paginationRow}>
                  {Array.from({ length: authPageIndex }).map((_, dotIndex) => {
                    const active = index === dotIndex;

                    return (
                      <View
                        key={`${step.title}-${dotIndex}`}
                        style={[
                          screenStyles.paginationDot,
                          active ? screenStyles.paginationDotActive : null,
                        ]}
                      />
                    );
                  })}
                </View>

                <TouchableOpacity onPress={() => void goToPage(index + 1)} style={screenStyles.onboardingButton}>
                  <Text style={screenStyles.onboardingButtonText}>
                    {index === authPageIndex - 1 ? "Get Started" : "Next"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <ScrollView
            keyboardShouldPersistTaps="handled"
            key="auth-screen"
            showsVerticalScrollIndicator={false}
            style={[screenStyles.onboardingViewport, { width }]}
            contentContainerStyle={screenStyles.loginScreenContent}
          >
            <View style={screenStyles.onboardingTopRow}>
              <Text style={screenStyles.authHeroLabel}>MIST Workspace</Text>
              <TouchableOpacity onPress={() => void goToPage(0)}>
                <Text style={screenStyles.onboardingSkip}>Back</Text>
              </TouchableOpacity>
            </View>

            <View style={screenStyles.authPanelWrap}>
              <View style={screenStyles.authStage}>
                <View style={screenStyles.authHeaderPanel}>
                  <View style={screenStyles.authHeaderOrbLeft} />
                  <View style={screenStyles.authHeaderOrbRight} />
                  <View style={screenStyles.authHeaderOrbSoft} />
                  <Text style={screenStyles.authHeaderEyebrow}>MIST policy workspace</Text>
                  <Text style={screenStyles.authHeaderTitle}>Sign in to MIST</Text>
                  <Text style={screenStyles.authHeaderBody}>
                    Your AI assistant for company policies and handbook guidance.
                  </Text>
                </View>
              </View>

              <Animated.View
                style={[
                  screenStyles.authCard,
                  {
                    opacity: cardFade,
                    transform: [
                      {
                        translateY: cardFade.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={screenStyles.authFormBlock}>
                  <Controller
                    control={control}
                    name="username"
                    render={({ field, fieldState }) => (
                      <View style={screenStyles.field}>
                        <Text style={screenStyles.floatingLabel}>Work email</Text>
                        <TextInput
                          autoCapitalize="none"
                          autoComplete="email"
                          keyboardType="email-address"
                          onBlur={field.onBlur}
                          onChangeText={field.onChange}
                          placeholder="name@company.com"
                          placeholderTextColor="#8c94b5"
                          style={screenStyles.authInput}
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
                        <Text style={screenStyles.floatingLabel}>Password</Text>
                        <View style={screenStyles.authPasswordRow}>
                          <TextInput
                            autoComplete="password"
                            onBlur={field.onBlur}
                            onChangeText={field.onChange}
                            placeholder="Enter your password"
                            placeholderTextColor="#8c94b5"
                            secureTextEntry={!showPassword}
                            style={[screenStyles.authInput, screenStyles.authPasswordInput]}
                            value={field.value}
                          />
                          <TouchableOpacity
                            onPress={() => setShowPassword((value) => !value)}
                            style={screenStyles.authPasswordToggle}
                          >
                            <Text style={screenStyles.authPasswordToggleText}>{showPassword ? "Hide" : "Show"}</Text>
                          </TouchableOpacity>
                        </View>
                        {fieldState.error ? <Text style={screenStyles.error}>{fieldState.error.message}</Text> : null}
                      </View>
                    )}
                  />
                </View>

                <View style={screenStyles.authSecondaryRow}>
                  <Text style={screenStyles.authSecondaryHint}>Your session stays protected on this device.</Text>
                  <TouchableOpacity>
                    <Text style={screenStyles.authSecondaryLink}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <Pressable
                    disabled={mutation.isPending}
                    onPress={onSubmit}
                    onPressIn={() => animateButton(0.975)}
                    onPressOut={() => animateButton(1)}
                    style={({ pressed }) => [
                      screenStyles.authPrimaryButton,
                      pressed ? screenStyles.authPrimaryButtonPressed : null,
                    ]}
                  >
                    {mutation.isPending ? (
                      <View style={screenStyles.authButtonLoadingRow}>
                        <ActivityIndicator color="#ffffff" size="small" />
                        <Text style={screenStyles.authPrimaryButtonText}>Logging In</Text>
                      </View>
                    ) : (
                      <Text style={screenStyles.authPrimaryButtonText}>Log In</Text>
                    )}
                  </Pressable>
                </Animated.View>

                {__DEV__ ? (
                  <TouchableOpacity onPress={() => router.push("/(main)/chat")} style={screenStyles.authPreviewButton}>
                    <Text style={screenStyles.authPreviewButtonText}>Preview Chat</Text>
                  </TouchableOpacity>
                ) : null}

                {mutation.error ? <Text style={screenStyles.error}>{mutation.error.message}</Text> : null}

                <Text style={screenStyles.authLegalText}>
                  By continuing, you agree to the <Text style={screenStyles.authLegalAction}>Privacy Policy</Text> and{" "}
                  <Text style={screenStyles.authLegalAction}>Terms of Use</Text>.
                </Text>

                {env.supportEmail ? (
                  <TouchableOpacity onPress={() => void contactSupport()}>
                    <Text style={screenStyles.authBottomPrompt}>
                      Need access? <Text style={screenStyles.authBottomAction}>Email {env.supportEmail}</Text>
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={screenStyles.authBottomPrompt}>
                    Need access? <Text style={screenStyles.authBottomMuted}>Ask your administrator for your MIST invite.</Text>
                  </Text>
                )}
              </Animated.View>
            </View>
          </ScrollView>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
