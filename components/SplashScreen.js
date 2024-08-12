import React, { useEffect,useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing,withSequence,withSpring } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
const SplashScreen = ({onAnimationFinish }) => {
  const { width, height } = useWindowDimensions();
  const [animationFinished,setAnimationFinished] = useState(false)

  const shortBoxWidth = width * 0.04;
  const longBoxWidth = width * 0.04;
  const midBoxWidth = width * 0.3;

  const shortBoxHeight = height * 0.07;
  const longBoxHeight = height * 0.1;
  const midBoxHeight = height * 0.02;

  const centerX = (width / 2 - shortBoxWidth / 2) - (width / 4);
  const centerX2 = (width / 2 - shortBoxWidth / 2) - (width / -4);
  const centerY = height / 2 - shortBoxHeight / 2;

  const longCenterX = width / 2 - longBoxWidth / 2 - (width / 5.5);
  const longCenterX2 = width / 2 - longBoxWidth / 2 - (width / -5.5);
  const longCenterY = height / 2 - longBoxHeight / 2;

  const midCenterX = width / 2 - midBoxWidth / 2;
  const midCenterY = height / 2 - midBoxHeight / 2;

  const heartSize = 40; // Kalbin boyutu
  const heartCenterX = width / 2 - heartSize / 2;
  const heartCenterY = height / 2 - heartSize / 2 - (height/height*26);

  const shortBoxAnim = useSharedValue(-shortBoxHeight);
  const shortBoxAnim2 = useSharedValue(-shortBoxHeight);

  const longBoxAnim = useSharedValue(-longBoxHeight);
  const longBoxAnim2 = useSharedValue(-longBoxHeight);

  const midBoxAnim = useSharedValue(-midBoxHeight);

  const heartAnim = useSharedValue(-heartSize);
  const heartRotate = useSharedValue(0);
  const heartScale = useSharedValue(1);

  useEffect(() => {
    setTimeout(() => {
        shortBoxAnim.value = withTiming(centerY, {
          duration: 1000,
          easing: Easing.bounce,
        });
      }, 0);

      setTimeout(() => {
        longBoxAnim.value = withTiming(longCenterY, {
          duration: 1000,
          easing: Easing.bounce,
        });
      }, 500);

      setTimeout(() => {
        midBoxAnim.value = withTiming(midCenterY, {
          duration: 1000,
          easing: Easing.bounce,
        });
      }, 800);

      setTimeout(() => {
        longBoxAnim2.value = withTiming(longCenterY, {
          duration: 1000,
          easing: Easing.bounce,
        });
      }, 1100);

      setTimeout(() => {
        shortBoxAnim2.value = withTiming(centerY, {
          duration: 1000,
          easing: Easing.bounce,
        });
      }, 1400);

      setTimeout(() => {
        heartAnim.value = withTiming(heartCenterY, {
          duration: 1000,
          easing: Easing.bounce,
        });

        setTimeout(() => {
          heartRotate.value = withTiming(0, {
            duration: 500,
            easing: Easing.linear,
          });

          setTimeout(() => {
            heartScale.value = withSequence(
              withTiming(1.5, { duration: 1000, easing: Easing.linear }),
              withTiming(0.5, { duration: 1000, easing: Easing.linear }),
              withTiming(100, { duration: 1000, easing: Easing.linear }),
            );
          }, 500);
        }, 1000);
      }, 2500);

      setTimeout(() => {
        onAnimationFinish();
      }, 1000);
  }, []);

  const animatedShortBoxStyle = useAnimatedStyle(() => {
    return {
      top: shortBoxAnim.value,
    };
  });
  const animatedShortBoxStyle2 = useAnimatedStyle(() => {
    return {
      top: shortBoxAnim2.value,
    };
  });
  const animatedLongBoxStyle = useAnimatedStyle(() => {
    return {
      top: longBoxAnim.value,
    };
  });
  const animatedLongBoxStyle2 = useAnimatedStyle(() => {
    return {
      top: longBoxAnim2.value,
    };
  });
  const animatedMidBoxStyle = useAnimatedStyle(() => {
    return {
      top: midBoxAnim.value,
    };
  });

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      top: heartAnim.value,
      transform: [
        { rotate: `${heartRotate.value}deg` },
        { scale: heartScale.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.shortBox, { left: centerX }, animatedShortBoxStyle]} />
      <Animated.View style={[styles.longBox, { left: longCenterX }, animatedLongBoxStyle]} />
      <Animated.View style={[styles.midBox, { left: midCenterX }, animatedMidBoxStyle]} />
      <Animated.View style={[styles.shortBox, { left: centerX2 }, animatedShortBoxStyle2]} />
      <Animated.View style={[styles.longBox, { left: longCenterX2 }, animatedLongBoxStyle2]} />
      <Animated.View style={[styles.heart, { left: heartCenterX }, animatedHeartStyle]}>
        <FontAwesome name="heart" size={heartSize} color="#1e1e1e" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },
  shortBox: {
    width: '4%',
    height: '7%',
    backgroundColor: 'red',
    borderRadius: 6,
    position: 'absolute',
  },
  longBox: {
    width: '4%',
    height: '10%',
    backgroundColor: '#bf2828',
    borderRadius: 6,
    position: 'absolute',
  },
  midBox: {
    width: '30%',
    height: '2%',
    backgroundColor: '#920303',
    borderRadius: 6,
    position: 'absolute',
  },
  heart:{
    position:'absolute',
  }
});

export default SplashScreen;
