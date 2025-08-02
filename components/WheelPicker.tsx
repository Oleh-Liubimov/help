import React, { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

type WheelPickerProps = {
  data: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  width: number;
  minIndex?: number;
};

const WheelPicker = ({
  data,
  selectedIndex,
  onChange,
  width,
  minIndex = 0,
}: WheelPickerProps) => {
  const flatListRef = useRef<FlatList>(null);

  React.useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < data.length) {
      flatListRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: false,
      });
    }
  }, [selectedIndex, data.length]);

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    let index = Math.round(offsetY / ITEM_HEIGHT);

    if (index < minIndex) {
      if (index !== minIndex) {
        index = minIndex;
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }
    } else {
      index = Math.min(index, data.length - 1);
    }
    onChange(index);
  };

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      keyExtractor={(item, index) => item + index}
      style={{ width }}
      contentContainerStyle={{
        paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
      }}
      showsVerticalScrollIndicator={false}
      getItemLayout={getItemLayout}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={onMomentumScrollEnd}
      bounces={false}
      renderItem={({ item, index }) => {
        const isSelected = index === selectedIndex;
        return (
          <View style={[styles.item, { width }]}>
            <Text style={[styles.itemText, isSelected && styles.selectedText]}>
              {item}
            </Text>
          </View>
        );
      }}
    />
  );
};

type TimePickerProps = {
  hours: string[];
  minutes: string[];
  selectedHour: string;
  selectedMinute: string;
  onChange: (hour: string, minute: string) => void;
};

export const TimePicker = ({
  hours,
  minutes,
  selectedHour,
  selectedMinute,
  onChange,
}: TimePickerProps) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const currentHourIndex = hours.indexOf(String(currentHour).padStart(2, "0"));
  const currentMinuteIndex = findMinuteMinIndex(minutes, currentMinute);

  const initialHourIndex = Math.max(
    hours.indexOf(selectedHour),
    currentHourIndex
  );
  const initialMinuteIndex =
    initialHourIndex === currentHourIndex
      ? Math.max(minutes.indexOf(selectedMinute), currentMinuteIndex)
      : minutes.indexOf(selectedMinute);

  const [hourIndex, setHourIndex] = useState(initialHourIndex);
  const [minuteIndex, setMinuteIndex] = useState(initialMinuteIndex);

  const onHourChange = (index: number) => {
    // Забороняємо вибрати годину раніше поточної
    if (index < currentHourIndex) {
      index = currentHourIndex;
    }
    setHourIndex(index);

    // Якщо вибрана година == поточна, хвилина має бути >= поточної
    if (index === currentHourIndex && minuteIndex < currentMinuteIndex) {
      setMinuteIndex(currentMinuteIndex);
      onChange(hours[index], minutes[currentMinuteIndex]);
    } else {
      onChange(hours[index], minutes[minuteIndex]);
    }
  };

  const onMinuteChange = (index: number) => {
    // Якщо вибрана година == поточна, хвилина не може бути менше поточної
    if (hourIndex === currentHourIndex && index < currentMinuteIndex) {
      index = currentMinuteIndex;
    }
    setMinuteIndex(index);
    onChange(hours[hourIndex], minutes[index]);
  };

  const minuteMinIndex =
    hourIndex === currentHourIndex ? currentMinuteIndex : 0;

  return (
    <View style={styles.container}>
      <View style={styles.highlight} pointerEvents="none" />

      <View style={styles.pickersWrapper}>
        <WheelPicker
          data={hours}
          selectedIndex={hourIndex}
          onChange={onHourChange}
          width={80}
          minIndex={currentHourIndex}
        />
        <WheelPicker
          data={minutes}
          selectedIndex={minuteIndex}
          onChange={onMinuteChange}
          width={80}
          minIndex={minuteMinIndex}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    position: "relative",
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickersWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  itemText: {
    fontSize: 16,
    color: "#aaa",
  },
  selectedText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },
  colon: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  highlight: {
    position: "absolute",
    top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: "#a1b596",
    borderRadius: 10,
    zIndex: -1,
  },
});
function findMinuteMinIndex(minutes: string[], currentMinute: number) {
  for (let i = 0; i < minutes.length; i++) {
    if (Number(minutes[i]) >= currentMinute) {
      return i;
    }
  }
  // Якщо всі менші — повертаємо 0 (або останній, залежно від логіки)
  return 0;
}
