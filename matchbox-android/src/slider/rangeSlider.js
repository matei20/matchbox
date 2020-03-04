import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const SCREEN_WIDTH = Dimensions.get('window').width;
const RangeSlider = props => {
    const { minAge, maxAge, onValuesChange, onEndEditing } = props;

    return (
        <View style={{ marginBottom: 10 }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <Text style={{ textAlign: "left" }}>Age Range: </Text>
                <Text style={{ textAlign: "right" }}>{minAge} - {maxAge}</Text>
            </View>
            <MultiSlider
                values={[minAge, maxAge]}
                sliderLength={280}
                onValuesChangeFinish={onEndEditing}
                onValuesChange={onValuesChange}
                min={18}
                max={100}
                step={1}
                sliderLength={SCREEN_WIDTH * 0.85}
                touchDimensions={{
                    height: 100,
                    width: 100,
                }}
                containerStyle={{ marginLeft: 10, marginRight: 10 }}
                selectedStyle={{ backgroundColor: "#e17a2d" }}
                markerStyle={{
                    height: 27,
                    width: 27,
                    borderRadius: 30,
                    borderWidth: 3,
                    borderColor: '#e17a2d',
                    backgroundColor: '#FFFFFF',
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowRadius: 1,
                    shadowOpacity: 0.2,
                }}
                pressedMarkerStyle={{
                    height: 31,
                    width: 31,
                }}

            />
        </View>
    )
}


export default RangeSlider;