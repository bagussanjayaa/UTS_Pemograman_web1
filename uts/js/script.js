// login
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const user = dataPengguna.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Email atau password yang Anda masukkan salah!");
    return;
  }

  localStorage.setItem("userLogin", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

// modal popup
function showPopup(type) {
  const modal = document.getElementById("popupBox");
  const content = document.getElementById("popupContent");

  if (type === "forgot") {
    content.innerHTML = "<h3>Lupa Password</h3><p>Silakan hubungi admin untuk reset password.</p>";
  } else if (type === "register") {
    content.innerHTML = "<h3>Daftar Akun Baru</h3><p>Fitur ini belum tersedia.</p>";
  }

  modal.style.display = "block";
}

function closePopup() {
  document.getElementById("popupBox").style.display = "none";
}

// greeting dashboard
window.addEventListener("DOMContentLoaded", () => {
  const greet = document.getElementById("greeting");
  if (greet) {
    const jam = new Date().getHours();
    let ucapan = "Selamat Datang";
    if (jam < 12) ucapan = "Selamat Pagi 🌞";
    else if (jam < 18) ucapan = "Selamat Siang 🌤️";
    else ucapan = "Selamat Malam 🌙";

    const user = JSON.parse(localStorage.getItem("userLogin"));
    greet.textContent = `${ucapan}, ${user ? user.nama : 'Pengguna'}!`;
  }

  // isi tabel stok otomatis
  if (document.getElementById("tabelBuku")) tampilkanKatalog();

  // isi dropdown buku di checkout
  if (document.getElementById("kodeBuku")) isiDropdownBuku();
});

// stok
function tampilkanKatalog() {
  const tbody = document.querySelector("#tabelBuku tbody");
  tbody.innerHTML = "";
  dataKatalogBuku.forEach(buku => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${buku.kodeBarang}</td>
      <td>${buku.namaBarang}</td>
      <td>${buku.jenisBarang}</td>
      <td>${buku.edisi}</td>
      <td>${buku.stok}</td>
      <td>${buku.harga}</td>
      <td><img src="${buku.cover}" alt="${buku.namaBarang}" width="60"></td>
    `;
    tbody.appendChild(tr);
  });
}

function tambahBuku(e) {
  e.preventDefault();
  const bukuBaru = {
    kodeBarang: document.getElementById("kodeBarang").value,
    namaBarang: document.getElementById("namaBarang").value,
    jenisBarang: document.getElementById("jenisBarang").value,
    edisi: document.getElementById("edisi").value,
    stok: document.getElementById("stok").value,
    harga: document.getElementById("harga").value,
    cover: "img/default.jpg"
  };

  dataKatalogBuku.push(bukuBaru);
  tampilkanKatalog();
  alert("Buku baru berhasil ditambahkan!");
  document.getElementById("formTambahBuku").reset();
}

// pemesanan
function isiDropdownBuku() {
  const select = document.getElementById("kodeBuku");
  dataKatalogBuku.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.kodeBarang;
    opt.textContent = `${b.namaBarang} (${b.harga})`;
    select.appendChild(opt);
  });
}

function prosesPesanan(e) {
  e.preventDefault();
  const nama = document.getElementById("namaPemesan").value;
  const kode = document.getElementById("kodeBuku").value;
  const jumlah = document.getElementById("jumlah").value;
  const metode = document.getElementById("metode").value;

  const buku = dataKatalogBuku.find(b => b.kodeBarang === kode);
  const total = buku ? `Rp ${parseInt(buku.harga.replace(/\D/g,'')) * jumlah}` : "Rp 0";

  document.getElementById("hasilPesanan").innerHTML = `
    <h3>Pesanan Berhasil!</h3>
    <p>Nama: ${nama}</p>
    <p>Buku: ${buku.namaBarang}</p>
    <p>Jumlah: ${jumlah}</p>
    <p>Total Pembayaran: ${total}</p>
    <p>Metode: ${metode}</p>
  `;
}

// tracking
function cariPengiriman() {
  const input = document.getElementById("nomorDO").value.trim();
  const data = dataTracking[input];

  const hasil = document.getElementById("hasilTracking");
  if (!data) {
    hasil.innerHTML = "<p style='color:red;'>Nomor Delivery Order tidak ditemukan.</p>";
    return;
  }

  let perjalananHTML = "";
  data.perjalanan.forEach((p, i) => {
    perjalananHTML += `<p><strong>${i + 1}. ${p.waktu}</strong> - ${p.keterangan}</p>`;
  });

  hasil.innerHTML = `
    <h3>Detail Pengiriman</h3>
    <p><strong>Nama:</strong> ${data.nama}</p>
    <p><strong>Status:</strong> ${data.status}</p>
    <div class="progress"><div class="progress-bar" style="width:${(data.perjalanan.length / 6) * 100}%"></div></div>
    <p><strong>Ekspedisi:</strong> ${data.ekspedisi} (${data.nomorResi})</p>
    <p><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</p>
    <p><strong>Total:</strong> ${data.total}</p>
    <hr>
    <h4>Riwayat Perjalanan:</h4>
    ${perjalananHTML}
  `;
}
