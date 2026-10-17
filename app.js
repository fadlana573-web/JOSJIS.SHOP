 const NOMOR_WHATSAPP = "62895422648909";

    const NAMA_TOKO = "JOSJIS SHOPE";

    // Data hanya terdiri dari 2 produk.
    const products = [
      {
        id: 1,
        name: "basreng asin josjis 50gr",
        price: 7000
      },
      {
        id: 2,
        name: "basreng pedas josjis 50gr",
        price: 7000
      }
    ];

    // Keranjang disimpan selama halaman masih terbuka.
    let cart = {};

    const rupiah = (number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }).format(number);
    };

    function addToCart(id) {
      cart[id] = (cart[id] || 0) + 1;
      renderCart();
      showToast("✓ Produk berhasil ditambahkan!");
    }

    function changeQuantity(id, amount) {
      cart[id] = (cart[id] || 0) + amount;

      if (cart[id] <= 0) {
        delete cart[id];
      }

      renderCart();
    }

    function renderCart() {
      const itemsElement = document.getElementById("cart-items");
      const countElement = document.getElementById("cart-count");
      const totalElement = document.getElementById("cart-total");
      const checkoutButton = document.getElementById("checkout-button");

      let totalItems = 0;
      let totalPrice = 0;
      let html = "";

      products.forEach((product) => {
        const quantity = cart[product.id] || 0;

        if (quantity > 0) {
          const subtotal = product.price * quantity;

          totalItems += quantity;
          totalPrice += subtotal;

          html += `
            <div class="cart-item">
              <div>
                <strong>${product.name}</strong>
                <small>${rupiah(product.price)} × ${quantity}</small>
                <br>
                <small>Subtotal: ${rupiah(subtotal)}</small>
              </div>

              <div class="quantity">
                <button
                  onclick="changeQuantity(${product.id}, -1)"
                  aria-label="Kurangi jumlah"
                >−</button>

                <strong>${quantity}</strong>

                <button
                  onclick="changeQuantity(${product.id}, 1)"
                  aria-label="Tambah jumlah"
                >+</button>
              </div>
            </div>
          `;
        }
      });

      itemsElement.innerHTML = html ||
        '<div class="empty-cart">Keranjang masih kosong. Yuk, pilih produk basreng favoritmu!</div>';

      countElement.textContent = totalItems;
      totalElement.textContent = rupiah(totalPrice);
      checkoutButton.disabled = totalItems === 0;
    }

    function checkoutWhatsApp() {
      const nomor = NOMOR_WHATSAPP.replace(/\D/g, "");

      if (!/^62\d{8,15}$/.test(nomor)) {
        alert("Nomor WhatsApp toko belum benar. Silakan periksa pengaturan NOMOR_WHATSAPP.");
        return;
      }

      const selectedProducts = products.filter(
        product => (cart[product.id] || 0) > 0
      );

      if (selectedProducts.length === 0) {
        alert("Keranjang belanja masih kosong!");
        return;
      }

      let total = 0;

      let pesan = `Halo ${NAMA_TOKO}! 👋\n`;
      pesan += "Saya ingin memesan produk berikut:\n\n";

      selectedProducts.forEach((product, index) => {
        const quantity = cart[product.id];
        const subtotal = product.price * quantity;

        total += subtotal;

        pesan += `${index + 1}. ${product.name}\n`;
        pesan += `   Harga: ${rupiah(product.price)}\n`;
        pesan += `   Jumlah: ${quantity}\n`;
        pesan += `   Subtotal: ${rupiah(subtotal)}\n\n`;
      });

      pesan += "------------------------\n";
      pesan += `TOTAL PRODUK: ${Object.values(cart).reduce((a, b) => a + b, 0)} pcs\n`;
      pesan += `TOTAL HARGA: ${rupiah(total)}\n\n`;
      pesan += "Mohon informasi stok dan cara pembayarannya. Terima kasih!";

      const url = "https://wa.me/" + nomor +
        "?text=" + encodeURIComponent(pesan);

      window.open(url, "_blank", "noopener,noreferrer");
    }

    function goToCart() {
      document.getElementById("keranjang").scrollIntoView({
        behavior: "smooth"
      });
    }

    let toastTimer;

    function showToast(message) {
      const toast = document.getElementById("toast");

      toast.textContent = message;
      toast.classList.add("show");

      clearTimeout(toastTimer);

      toastTimer = setTimeout(() => {
        toast.classList.remove("show");
      }, 2000);
    }

    document.getElementById("year").textContent =
      new Date().getFullYear();

    renderCart();