<?php
$CATEGORIES = ["ทั้งหมด", "อิเล็กทรอนิกส์", "บ้าน & ครัว", "ตกแต่งบ้าน", "แฟชั่น", "ความงาม", "กีฬา"];
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Shopee Affiliate</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="main-header">
            <div>
                <h1>Mini Shopee Affiliate</h1>
                <p class="subtitle">หน้าร้านมินิสำหรับลิงก์ Affiliate — ค้นหา/กรอง/คัดลอกลิงก์ได้ทันที</p>
            </div>
            <div class="header-buttons">
                <button class="ghost-button" id="open-add-modal-btn">➕ เพิ่มสินค้า</button>
                <button class="primary-button" id="open-settings-modal-btn">⚙️ ตั้งค่า</button>
            </div>
        </header>

        <!-- Controls Card -->
        <div class="card control-card">
            <div class="search-bar">
                <span>🔍</span>
                <input type="text" id="search-input" placeholder="ค้นหาสินค้า…">
            </div>
            <select id="category-filter">
                <?php foreach ($CATEGORIES as $c): ?>
                    <option value="<?= htmlspecialchars($c) ?>"><?= htmlspecialchars($c) ?></option>
                <?php endforeach; ?>
            </select>
            <select id="sort-by">
                <option value="popularity">เรียงตามยอดขาย</option>
                <option value="price_asc">ราคาต่ำไปสูง</option>
                <option value="name_asc">ชื่อสินค้า (ก-ฮ)</option>
            </select>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="card stat-card">
                <div class="stat-title">คลิกรวมทั้งหมด</div>
                <div id="total-clicks-stat" class="stat-value">0</div>
            </div>
            <div class="card stat-card">
                <div class="stat-title">จำนวนสินค้า</div>
                <div id="total-products-stat" class="stat-value">0</div>
            </div>
            <div class="card stat-card">
                <div class="stat-title">
                    <span>สถิติการคลิก</span>
                    <span>📈</span>
                </div>
                 <div id="chart-placeholder" class="stat-value">📊</div>
            </div>
        </div>

        <!-- Product Grid -->
        <div id="product-grid" class="product-grid">
            <!-- สินค้าจะถูกใส่ที่นี่โดย JavaScript -->
        </div>
        <div id="no-results" class="no-results hidden">
            ไม่พบสินค้า ตรงตามเงื่อนไขค้นหา/กรอง
        </div>
    </div>

    <!-- Modals (โครงสร้างเหมือนเดิม แต่จะถูกจัดสไตล์ใหม่ด้วย CSS) -->
    <div id="add-modal" class="modal-wrapper hidden">
        <div class="modal-overlay"></div>
        <div class="modal-content card">
            <div class="modal-header">
                <h3>เพิ่มสินค้า</h3>
                <button class="close-modal-btn">&times;</button>
            </div>
            <form id="add-product-form" class="modal-body">
                <div class="form-grid">
                    <label>ชื่อสินค้า<input type="text" name="name" placeholder="เช่น เคสมือถือกันกระแทก" required></label>
                    <label>ราคา (บาท)<input type="number" name="price" placeholder="0" step="0.01" required></label>
                </div>
                <label>ลิงก์สินค้า (Shopee)<input type="url" name="url" placeholder="https://shopee.co.th/..." required></label>
                <label>ลิงก์รูปภาพ<input type="url" name="image" placeholder="https://..."></label>
                <label>หมวดหมู่
                    <select name="category">
                        <?php foreach ($CATEGORIES as $c): if ($c === "ทั้งหมด") continue; ?>
                            <option value="<?= htmlspecialchars($c) ?>"><?= htmlspecialchars($c) ?></option>
                        <?php endforeach; ?>
                    </select>
                </label>
                <div class="modal-footer">
                     <span class="form-hint">* ต้องกรอกอย่างน้อย ชื่อ / ราคา / ลิงก์</span>
                    <button type="submit" class="primary-button">➕ เพิ่มสินค้า</button>
                </div>
            </form>
        </div>
    </div>

    <div id="settings-modal" class="modal-wrapper hidden">
        <div class="modal-overlay"></div>
        <div class="modal-content card">
            <div class="modal-header">
                <h3>ตั้งค่า Affiliate & UTM</h3>
                <button class="close-modal-btn">&times;</button>
            </div>
            <form id="settings-form" class="modal-body">
                <div class="form-grid">
                    <label>คีย์ Affiliate ID <input type="text" name="affiliateParamKey"></label>
                    <label>Affiliate ID <input type="text" name="affiliateId"></label>
                    <label>คีย์ Sub ID (ทางเลือก) <input type="text" name="subIdKey"></label>
                    <label>ค่า Sub ID (ทางเลือก) <input type="text" name="subIdValue"></label>
                    <label>UTM Source <input type="text" name="utmSource"></label>
                    <label>UTM Medium <input type="text" name="utmMedium"></label>
                    <label>UTM Campaign <input type="text" name="utmCampaign"></label>
                </div>
                <div class="modal-footer">
                    <button type="button" class="ghost-button close-modal-btn">ปิด</button>
                    <button type="submit" class="primary-button">บันทึกการตั้งค่า</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="toast" class="toast hidden"></div>
</body>
</html>