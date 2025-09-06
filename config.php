<?php
// -- การตั้งค่าการเชื่อมต่อฐานข้อมูล --
// แก้ไขค่าเหล่านี้ให้ตรงกับข้อมูลบน Hostinger ของคุณ

define('DB_HOST', 'localhost'); // <-- ค่านี้ถูกต้องแล้ว ไม่ต้องเปลี่ยน

// VVV แก้ไข 2 บรรทัดนี้ VVV
define('DB_NAME', 'u400781790_minishop'); // <-- ชื่อฐานข้อมูลที่ถูกต้องจากรูป
define('DB_USER', 'u400781790_minishop');    // <-- ชื่อผู้ใช้ที่ถูกต้อง (เหมือนชื่อฐานข้อมูล)

// VVV ตรวจสอบบรรทัดนี้ VVV
define('DB_PASS', '@Aa1212312121.'); // <-- ตรวจสอบให้แน่ใจว่านี่คือ "รหัสผ่านของฐานข้อมูล" ที่คุณตั้งไว้ ไม่ใช่รหัสผ่านเข้าระบบ Hostinger

// -- ฟังก์ชันสำหรับเชื่อมต่อฐานข้อมูล (ไม่ต้องแก้ไข) --
function db_connect() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}
?>