import { Button, StyleSheet, Text } from "react-native";

import { TimePicker } from "@/components/WheelPicker";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const now = new Date();

  const [selectedHour, setSelectedHour] = useState(now.getHours().toString());
  const [selectedMinute, setSelectedMinute] = useState("30");

  const hours = Array.from({ length: 24 }, (_, i) => `${i}`.padStart(2, "0"));
  const minutes = ["00", "15", "30", "45", "00"];

  const handleTimeChange = (hour: string, minute: string) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    console.log("Time changed:", hour, minute);
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const snapPoints = useMemo(() => {
    return ["30%"];
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Here</Text>

      <Button title="Open" onPress={handlePresentModalPress} />

      <BottomSheetModal
        enablePanDownToClose
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        index={1}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>

          <TimePicker
            hours={hours}
            minutes={minutes}
            selectedHour={selectedHour}
            selectedMinute={selectedMinute}
            onChange={handleTimeChange}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
