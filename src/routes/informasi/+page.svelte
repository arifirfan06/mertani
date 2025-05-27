<script>
  // Example static data – in real case, load from load() function
  const device = {
    name: "Pos Curah Hujan",
    id: "MTI-XYZHAHA",
    token: "b19d4fba-aced-44d6-9c50-f54002c2d0f3",
    password: "********",
    spec: "tidak berspesifikasi",
    description: "tidak memiliki deskripsi khusus",
    tag: "Tag 1",
    interval: "60 Menit",
    lastUpdate: "12-12-2025 19:00:07 WIB",
    location: {
      lat: -1.924123,
      lng: 116.09231,
    },
    installation: {
      date: "12-1-2025",
      installer: "Yutiman"
    }
  };
</script>

<div class="bg-white rounded-xl shadow border p-6 max-w-4xl mx-auto mt-4">
  <div class="flex justify-between items-start mb-6">
    <h2 class="text-lg font-semibold">Detail Device</h2>
    <button class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 text-sm rounded flex items-center gap-1">
      <img src="/settings.svg" alt="Settings" class="w-4 h-4">
      Pengaturan
    </button>
  </div>

  <!-- Data Pos Section -->
  <div class="space-y-3 mb-6">
    <h3 class="font-semibold text-gray-700">Data Pos</h3>
    
    <div><strong>Nama Device</strong>: {device.name}</div>
    <div><strong>Id Device</strong>: 
      <span class="inline-block bg-gray-100 px-2 py-1 rounded text-sm">{device.id}</span>
      <span class="inline-block ml-1 text-green-600">✔</span>
    </div>
    <div><strong>Token</strong>: 
      <span class="inline-block bg-gray-100 px-2 py-1 rounded text-sm">{device.token}</span>
    </div>
    <div><strong>Password</strong>: 
      <span class="inline-block bg-gray-100 px-2 py-1 rounded text-sm">{device.password}</span>
    </div>
    <div><strong>Spesifikasi</strong>: {device.spec}</div>
    <div><strong>Deskripsi</strong>: {device.description}</div>
    <div><strong>Tag Device</strong>: 
      <span class="bg-gray-100 px-2 py-1 rounded-full text-xs">{device.tag}</span>
    </div>
    <div><strong>Interval</strong>: {device.interval}</div>
    <div><strong>Last Update</strong>: {device.lastUpdate}</div>
  </div>

  <!-- Lokasi Section -->
  <div class="space-y-3 mb-6">
    <h3 class="font-semibold text-gray-700">Lokasi</h3>
    <div><strong>Latitude</strong>: {device.location.lat}</div>
    <div><strong>Longitude</strong>: {device.location.lng}</div>
  </div>

  <!-- Instalasi Section -->
  <div class="space-y-3">
    <h3 class="font-semibold text-gray-700">Instalasi</h3>
    <div><strong>Tanggal Pemasangan</strong>: {device.installation.date}</div>
    <div><strong>Instalator</strong>: {device.installation.installer}</div>
  </div>
</div>
