import React from 'react';
import { Animated, Sphere, View, asset } from 'react-vr';
import { Easing } from 'react-native';
import AnimatedMath from 'react-native-animated-math';

const Globe = Animated.createAnimatedComponent(Sphere);

const radians = degrees => degrees * Math.PI / 180;

export default class Planet extends React.Component {
  spin = new Animated.Value(0);
  rotation = new Animated.Value(0);

  componentDidMount() {
    this.startSpinning();
    this.startRotation();
  }

  startSpinning = () => {
    Animated.timing(this.spin, {
      toValue: 360,
      easing: Easing.linear,
      duration: this.props.dayDuration,
    }).start(() => {
      this.spin.setValue(0);
      this.startSpinning();
    });
  };

  startRotation = () => {
    Animated.timing(this.rotation, {
      toValue: 2 * Math.PI,
      easing: Easing.linear,
      duration: this.props.yearDuration,
    }).start(() => {
      this.rotation.setValue(0);
      this.startRotation();
    });
  };

  render() {
    const { elipsisRadius, axialTilt, radius, inclination } = this.props;
    // FIXME: Add sinus-like movement here:
    const inclinationDeviation = elipsisRadius * Math.sin(inclination);
    return (
      <View>
        <Globe
          style={{
            transform: [
              {
                translateX: Animated.multiply(
                  AnimatedMath.sinus(this.rotation),
                  -elipsisRadius
                ),
              },
              {
                translateZ: Animated.multiply(
                  AnimatedMath.cosinus(this.rotation),
                  elipsisRadius
                ),
              },
              {
                translateY: Animated.multiply(
                  AnimatedMath.sinus(this.rotation),
                  elipsisRadius * Math.sin(inclination)
                ),
              },
              { rotateY: this.spin },
            ],
          }}
          radius={radius}
          widthSegments={20}
          heightSegments={20}
          lit
          texture={asset(this.props.texture)}
        />
      </View>
    );
  }
}
