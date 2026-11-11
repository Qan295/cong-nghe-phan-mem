import 'dart:async';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:permission_handler/permission_handler.dart';

class BeaconService {
  bool _isScanning = false;
  
  // Stream truyền mã định danh hiện vật quét được sang phần giao diện (UI)
  final StreamController<String> _beaconController = StreamController<String>.broadcast();
  Stream<String> get beaconStream => _beaconController.stream;

  // Biến lưu trữ để chống lặp thông báo liên tục (Debounce)
  String? _lastDetectedBeaconId;
  DateTime? _lastDetectedTime;

  /// 1. Xin quyền Bluetooth và Vị trí từ thiết bị
  Future<bool> requestPermissions() async {
    Map<Permission, PermissionStatus> statuses = await [
      Permission.bluetoothScan,
      Permission.bluetoothConnect,
      Permission.location,
    ].request();

    if (statuses[Permission.bluetoothScan] == PermissionStatus.granted &&
        statuses[Permission.location] == PermissionStatus.granted) {
      return true;
    }
    return false;
  }

  /// 2. Bắt đầu quét tín hiệu iBeacon xung quanh
  Future<void> startScanning() async {
    bool hasPermission = await requestPermissions();
    if (!hasPermission) {
      print("⚠️ Người dùng từ chối cấp quyền Bluetooth hoặc Vị trí!");
      return;
    }

    if (await FlutterBluePlus.adapterState.first != BluetoothAdapterState.on) {
      print("⚠️ Bluetooth đang tắt. Vui lòng bật Bluetooth!");
      return;
    }

    if (_isScanning) return;
    _isScanning = true;

    // Lắng nghe kết quả quét thiết bị BLE
    FlutterBluePlus.scanResults.listen((results) {
      for (ScanResult result in results) {
        parseBeaconData(result);
      }
    });

    await FlutterBluePlus.startScan();
    print("📡 Đang quét tìm iBeacon...");
  }

  /// 3. Phân tích gói tin, lọc RSSI và chống lặp
  void parseBeaconData(ScanResult result) {
    int rssi = result.rssi;
    String deviceName = result.device.platformName;
    String beaconMacId = result.device.remoteId.toString();

    // Lọc thiết bị thuộc hệ thống Smart Heritage
    if (deviceName.contains("SmartHeritage") || result.advertisementData.localName.contains("Heritage")) {
      DateTime now = DateTime.now();

      // Thuật toán chống lặp (Debounce): Chỉ nhận diện lại nếu qua 5 giây hoặc đổi beacon khác
      if (_lastDetectedBeaconId != beaconMacId ||
          _lastDetectedTime == null ||
          now.difference(_lastDetectedTime!).inSeconds > 5) {
        
        _lastDetectedBeaconId = beaconMacId;
        _lastDetectedTime = now;

        _beaconController.add(beaconMacId);
        print("🎯 Đã nhận diện hiện vật! ID: $beaconMacId | RSSI: $rssi dBm");
      }
    }
  }

  /// 4. Dừng quét
  Future<void> stopScanning() async {
    await FlutterBluePlus.stopScan();
    _isScanning = false;
    print("🛑 Đã dừng quét iBeacon.");
  }

  void dispose() {
    _beaconController.close();
  }
}