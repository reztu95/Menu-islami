// ==================== VARIABEL GLOBAL ====================
let editIndex = null;
let editIndexArtikel = null;
let kota = "Jakarta";
let tanggal = new Date().toISOString().slice(0, 10);

// ==================== FORMAT ISI ====================
function formatIsiDoa(teks) {
  return teks
    .replace(/LATIN:/gi, '<strong>Latin:</strong><br>')
    .replace(/ARTINYA:/gi, '<br><strong>Artinya:</strong><br>')
    .replace(/KEUTAMAAN:/gi, '<br><strong>Keutamaan:</strong><br>')
    .replace(/\n/g, '<br>');
}

function formatIsiHadist(teks) {
  return teks
    .replace(/DARI:/gi, '<strong>Dari:</strong><br>')
    .replace(/MATAN:/gi, '<br><strong>Matan:</strong><br>')
    .replace(/ARTINYA:/gi, '<br><strong>Artinya:</strong><br>')
    .replace(/SANAD:/gi, '<br><strong>Sanad:</strong><br>')
    .replace(/KEDUDUKAN HADITS:/gi, '<br><strong>Kedudukan Hadits:</strong><br>')
    .replace(/\n/g, '<br>');
}

function formatIsiArtikel(teks) {
  return teks.replace(/\n/g, "<br>");
}

// ==================== DOA ====================
function tampilkanDoaThumbnail(filter = '') {
  const semuaDoa = JSON.parse(localStorage.getItem("doa") || "[]");
  const daftar = document.getElementById("daftarDoaThumbnail");
  if (!daftar) return;

  daftar.innerHTML = "";

  const hasil = filter
    ? semuaDoa.filter(d => d.kategori.toLowerCase() === filter.toLowerCase())
    : semuaDoa;

  if (hasil.length === 0) {
    daftar.innerHTML = "<p>Belum ada doa yang disimpan.</p>";
    return;
  }

  hasil.forEach(d => {
    const card = document.createElement("div");
    card.className = "thumbnail-card";

    card.innerHTML = `
      <h4 class="judul-doa" style="color:#0645AD; text-decoration: underline; cursor: pointer;">${d.judul}</h4>
      <p>${d.isi.length > 100 ? d.isi.substring(0, 100) + "..." : d.isi}</p>
      <p><strong>Kategori:</strong> ${d.kategori}</p>
    `;

    card.querySelector(".judul-doa").addEventListener("click", () => {
      document.getElementById("modalJudul").textContent = d.judul;
      document.getElementById("modalIsi").innerHTML = formatIsiDoa(d.isi);
      document.getElementById("modalKategori").textContent = `Kategori: ${d.kategori}`;
      document.getElementById("modalDoa").style.display = "flex";
    });

    daftar.appendChild(card);
  });
}

function bukaModalDoa(dataStr) {
  const data = JSON.parse(decodeURIComponent(dataStr));
  document.getElementById("modalJudul").textContent = data.judul;
  document.getElementById("modalIsi").innerHTML = formatIsiDoa(data.isi);
  document.getElementById("modalKategori").textContent = `Kategori: ${data.kategori}`;
  document.getElementById("modalDoa").style.display = "flex";
}

function tutupModalDoa() {
  document.getElementById("modalDoa").style.display = "none";
}

// ==================== HADIST ====================
function simpanHadist() {
  const judul = document.getElementById("judulHadist")?.value.trim();
  const isi = document.getElementById("isiHadist")?.value.trim();
  const kategori = document.getElementById("kategoriHadist")?.value.trim();
  if (!judul || !isi || !kategori) return alert("Semua kolom wajib diisi!");

  let data = JSON.parse(localStorage.getItem("hadist") || "[]");
  if (editIndex !== null) {
    data[editIndex] = { judul, isi, kategori };
    editIndex = null;
  } else {
    data.push({ judul, isi, kategori });
  }
  localStorage.setItem("hadist", JSON.stringify(data));
  resetForm();
  tampilkanHadist();
}

function tampilkanHadist() {
  const daftar = document.getElementById("daftarHadist");
  if (!daftar) return;

  const data = JSON.parse(localStorage.getItem("hadist") || "[]");
  daftar.innerHTML = "";
  if (data.length === 0) {
    daftar.innerHTML = "<p>Belum ada hadist.</p>";
    return;
  }

  const isDaftarPage = window.location.pathname.includes("daftar-hadist");

  data.forEach((h, i) => {
    const card = document.createElement("div");
    card.className = "thumbnail-card";
    const ringkasan = h.isi.length > 100 ? h.isi.substring(0, 100) + "..." : h.isi;
    const dataStr = encodeURIComponent(JSON.stringify(h));
    let tombol = isDaftarPage
      ? `<button class="btn-baca-hadist" data-hadist="${dataStr}">📖 Baca Selengkapnya</button>`
      : `
        <button onclick="editHadist(${i})">✏️ Edit</button>
        <button onclick="hapusHadist(${i})">🗑️ Hapus</button>`;

    card.innerHTML = `
      <h4 class="judul-artikel" style="color:#0645AD; text-decoration:underline; cursor:pointer;" data-artikel="${dataStr}">
  ${a.judul}
</h4>
<p>${ringkasan}</p>
${isInputPage ? `
  <button onclick="editArtikel(${i})">✏️ Edit</button>
  <button onclick="hapusArtikel(${i})">🗑️ Hapus</button>
` : ""}
    `;
    daftar.appendChild(card);
  });
}

function bukaModalHadist(dataStr) {
  const data = JSON.parse(decodeURIComponent(dataStr));
  document.getElementById("modalJudulHadist").textContent = data.judul;
  document.getElementById("modalIsiHadist").innerHTML = formatIsiHadist(data.isi);
  document.getElementById("modalKategoriHadist").textContent = `Kategori: ${data.kategori}`;
  document.getElementById("modalHadist").style.display = "flex";
}

function tutupModalHadist() {
  document.getElementById("modalHadist").style.display = "none";
}

function editHadist(index) {
  const data = JSON.parse(localStorage.getItem("hadist") || "[]");
  const h = data[index];
  document.getElementById("judulHadist").value = h.judul;
  document.getElementById("isiHadist").value = h.isi;
  document.getElementById("kategoriHadist").value = h.kategori;
  editIndex = index;
}

function hapusHadist(index) {
  if (!confirm("Yakin ingin menghapus hadist ini?")) return;
  const data = JSON.parse(localStorage.getItem("hadist") || "[]");
  data.splice(index, 1);
  localStorage.setItem("hadist", JSON.stringify(data));
  tampilkanHadist();
}

function resetForm() {
  const judul = document.getElementById("judulHadist");
  const isi = document.getElementById("isiHadist");
  const kategori = document.getElementById("kategoriHadist");
  if (judul) judul.value = "";
  if (isi) isi.value = "";
  if (kategori) kategori.value = "";
  editIndex = null;
}

// ==================== ARTIKEL ====================
function simpanArtikel() {
  const judul = document.getElementById("judulArtikel").value.trim();
  const isi = document.getElementById("isiArtikel").value.trim();
  const gambarInput = document.getElementById("gambarArtikel");

  if (!judul || !isi || (!gambarInput.files.length && editIndexArtikel === null)) {
    alert("Judul, isi, dan gambar wajib diisi!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const gambar = reader.result;

    let data = JSON.parse(localStorage.getItem("artikel") || "[]");
    const artikel = { judul, isi, gambar };

    if (editIndexArtikel !== null) {
      data[editIndexArtikel] = artikel;
      editIndexArtikel = null;
    } else {
      data.push(artikel);
    }

    localStorage.setItem("artikel", JSON.stringify(data));
    tampilkanArtikel();
    resetFormArtikel();
  };

  if (gambarInput.files.length) {
    reader.readAsDataURL(gambarInput.files[0]);
  } else {
    const data = JSON.parse(localStorage.getItem("artikel") || "[]");
    const artikel = {
      judul,
      isi,
      gambar: data[editIndexArtikel].gambar
    };
    data[editIndexArtikel] = artikel;
    localStorage.setItem("artikel", JSON.stringify(data));
    tampilkanArtikel();
    resetFormArtikel();
    editIndexArtikel = null;
  }
}

function tampilkanArtikel() {
  const container = document.getElementById("daftarArtikel");
  if (!container) return;

  const data = JSON.parse(localStorage.getItem("artikel") || "[]");
  container.innerHTML = data.length === 0 ? "<p>Belum ada artikel.</p>" : "";

  const isInputPage = window.location.pathname.includes("artikel.html");

  data.forEach((a, i) => {
    const ringkasan = a.isi.length > 100 ? a.isi.substring(0, 100) + "..." : a.isi;
    const dataStr = encodeURIComponent(JSON.stringify(a));

    const card = document.createElement("div");
    card.className = "thumbnail-card";
    card.innerHTML = `
      <img src="${a.gambar}" alt="Gambar Artikel" style="width:100%; height:120px; object-fit:cover; border-radius:8px;">
      <h4>${a.judul}</h4>
      <p>${ringkasan}</p>
      <button class="btn-baca-artikel" data-artikel="${dataStr}">📖 Baca</button>
      ${isInputPage ? `
        <button onclick="editArtikel(${i})">✏️ Edit</button>
        <button onclick="hapusArtikel(${i})">🗑️ Hapus</button>
      ` : ""}
    `;
    container.appendChild(card);
  });
}

function editArtikel(index) {
  const data = JSON.parse(localStorage.getItem("artikel") || "[]");
  const artikel = data[index];
  document.getElementById("judulArtikel").value = artikel.judul;
  document.getElementById("isiArtikel").value = artikel.isi;
  editIndexArtikel = index;
}

function hapusArtikel(index) {
  if (!confirm("Yakin ingin menghapus artikel ini?")) return;
  const data = JSON.parse(localStorage.getItem("artikel") || "[]");
  data.splice(index, 1);
  localStorage.setItem("artikel", JSON.stringify(data));
  tampilkanArtikel();
}

function resetFormArtikel() {
  document.getElementById("judulArtikel").value = "";
  document.getElementById("isiArtikel").value = "";
  document.getElementById("gambarArtikel").value = "";
  editIndexArtikel = null;
}

function bukaModalArtikel(dataStr) {
  const data = JSON.parse(decodeURIComponent(dataStr));
  document.getElementById("modalJudul").textContent = data.judul;
  document.getElementById("modalIsi").innerHTML = formatIsiArtikel(data.isi);
  document.getElementById("modalGambar").src = data.gambar;
  document.getElementById("modalArtikel").style.display = "flex";
}

function tutupModalArtikel() {
  document.getElementById("modalArtikel").style.display = "none";
}

// ==================== MENU ====================
function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("show");
}

// ==================== EVENT HANDLER ====================
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-baca-hadist")) {
    bukaModalHadist(e.target.getAttribute("data-hadist"));
  }
  if (e.target.classList.contains("btn-baca-doa")) {
    bukaModalDoa(e.target.getAttribute("data-doa"));
  }
  if (e.target.classList.contains("btn-baca-artikel")) {
    bukaModalArtikel(e.target.getAttribute("data-artikel"));
  }
});

// ==================== ON LOAD ====================
document.addEventListener("DOMContentLoaded", () => {
  tampilkanDoaThumbnail();
  tampilkanHadist();
  tampilkanArtikel();
});