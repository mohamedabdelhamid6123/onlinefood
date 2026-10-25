// ---------------------- Products Page ----------------------

// Buy Now → يفتح صفحة الدفع
document.querySelectorAll(".buy-now button").forEach((btn) => {
    btn.addEventListener("click", () => {
        window.location.href = "payment.html";
    });
});

// popup لرسالة سريعة
function showPopup(message, type = "add") {
    let popup = document.createElement("div");
    popup.className = `popup-msg ${type}`;
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 1800);
}

// تحديث الكميات عند فتح صفحة المنتجات
function loadQuantities() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.querySelectorAll(".best-p1").forEach((product) => {
        let name = product.querySelector(".name-of-p p").innerText;
        let item = cart.find(p => p.name === name);
        let qtySpan = product.querySelector(".qty");
        if (qtySpan) {
            qtySpan.innerText = item ? item.quantity : 0;
        }
    });
}
loadQuantities();

// زرار ➕
document.querySelectorAll(".increase").forEach((btn) => {
    btn.addEventListener("click", () => {
        let product = btn.closest(".best-p1");
        let name = product.querySelector(".name-of-p p").innerText;
        let priceText = product.querySelector(".price").innerText.replace("£", "").trim();
        let price = parseFloat(priceText) || 0;
        let image = product.querySelector(".product-img").src;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let item = cart.find(p => p.name === name);

        if (item) {
            item.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }

        // ✅ FIX: نجيب المنتج بعد التحديث
        let updatedItem = cart.find(p => p.name === name);

        localStorage.setItem("cart", JSON.stringify(cart));
        product.querySelector(".qty").innerText = updatedItem.quantity;

        showPopup("Added to cart", "add");
    });
});


// زرار ➖
document.querySelectorAll(".decrease").forEach((btn) => {
    btn.addEventListener("click", () => {
        let product = btn.closest(".best-p1");
        let name = product.querySelector(".name-of-p p").innerText;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let item = cart.find(p => p.name === name);
        if (item) {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                cart = cart.filter(p => p.name !== name);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            product.querySelector(".qty").innerText = item.quantity > 0 ? item.quantity : 0;

            showPopup("Item removed", "remove");
        }
    });
});

// Add to Cart → يضيف المنتج للسلة من غير ما يفتح cart.html
document.querySelectorAll(".add-cart button").forEach((btn) => {
    btn.addEventListener("click", () => {
        window.location.href = "cart.html";
    });
});

       
// ---------------------- Sign Up ----------------------
if (document.getElementById("signup-form")) {
    document.getElementById("signup-form").addEventListener("submit", function(e) {
        e.preventDefault();

        let name = document.getElementById("signup-name").value;
        let email = document.getElementById("signup-email").value;
        let password = document.getElementById("signup-password").value;

        // نخزن الحساب في localStorage
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let exists = users.find(u => u.email === email);

        if (exists) {
            alert("هذا الإيميل مسجل بالفعل ⚠️");
        } else {
            users.push({ name, email, password });
            localStorage.setItem("users", JSON.stringify(users));
            alert("تم إنشاء الحساب بنجاح ✅ .. سجل الدخول الآن");
            window.location.href = "login.html";
        }
    });
}

// ---------------------- Login ----------------------
if (document.getElementById("login-form")) {
    document.getElementById("login-form").addEventListener("submit", function(e) {
        e.preventDefault();

        let email = document.getElementById("login-email").value;
        let password = document.getElementById("login-password").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];
        let user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", JSON.stringify(user));
            alert("تم تسجيل الدخول بنجاح ✅");
            window.location.href = "index.html";
        } else {
            alert("البيانات غير صحيحة ❌ .. تأكد من الإيميل والباسورد");
        }
    });
}

// ---------------------- Navbar Auth ----------------------
window.addEventListener("DOMContentLoaded", () => {
    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    let navAuth = document.getElementById("nav-auth");

    if (navAuth) {
        if (isLoggedIn) {
            let user = JSON.parse(localStorage.getItem("currentUser"));
            navAuth.innerHTML = `
                <span>Welcome, ${user.name}</span>
                <button id="logout-btn">Logout</button>
            `;

            document.getElementById("logout-btn").addEventListener("click", () => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("currentUser");
                window.location.reload();
            });
        } else {
            navAuth.innerHTML = `
                <a href="login.html">Sign In</a> | 
                <a href="signup.html">Sign Up</a>
            `;
        }
    }
});

// ---------------------- Payment Page ----------------------
if (document.getElementById("pay-now")) {
    document.getElementById("pay-now").addEventListener("click", function(e) {
        let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
            e.preventDefault();
            alert("لازم تسجل دخول الأول قبل الدفع ⚠️");
            window.location.href = "login.html";
        } else {
            alert("تم الدفع بنجاح ✅");
            // ممكن تفضي السلة بعد الدفع
            localStorage.removeItem("cart");
        }
    });
}

// ---------------------- Cart Page ----------------------
if (document.getElementById("cart-items")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart-items");

    function renderCart() {
        cartContainer.innerHTML = "";
        if (cart.length === 0) {
            cartContainer.innerHTML = `<tr><td colspan="5">Your cart is empty</td></tr>`;
            return;
        }
        cart.forEach((item, index) => {
            let row = document.createElement("tr");

            // صورة المنتج
            let imgCell = document.createElement("td");
            let img = document.createElement("img");
            img.src = item.image || "https://via.placeholder.com/80";
            img.classList.add("product-img");
            imgCell.appendChild(img);

            // الاسم
            let nameCell = document.createElement("td");
            nameCell.textContent = item.name;

            // السعر × الكمية
            let priceCell = document.createElement("td");
            let total = (parseFloat(item.price) * item.quantity).toFixed(2);
            priceCell.textContent = `£${item.price} × ${item.quantity} = £${total}`;

            // زرار Delete
            let actionCell = document.createElement("td");
            let delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.classList.add("delete-btn");
            delBtn.onclick = () => {
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            };
            actionCell.appendChild(delBtn);

            row.appendChild(imgCell);
            row.appendChild(nameCell);
            row.appendChild(priceCell);
            row.appendChild(actionCell);

            cartContainer.appendChild(row);
        });
    }

    renderCart();
}

// ========== Save Signup ==========
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = signupForm.querySelector('input[type="email"]').value;
        const username = signupForm.querySelector('input[type="text"]').value;
        const password = signupForm.querySelector('input[type="password"]').value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        // ✅ check if email already exists
        if (users.some(user => user.email === email)) {
            alert("Email already registered, please log in.");
            return;
        }

        users.push({ email, username, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Account created successfully! You can now log in.");
        window.location.href = "login.html";
    });
}

// ========== Log In ==========
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const validUser = users.find(
            (user) => user.email === email && user.password === password
        );

        if (validUser) {
            localStorage.setItem("loggedInUser", JSON.stringify(validUser));
            alert("Login successful!");
            window.location.href = "index.html"; // ✅ back to home after login
        } else {
            alert("Invalid email or password.");
        }
    });
}

// ========== Navbar Update ==========
function updateNavbar() {
    const menu = document.querySelector(".menu-items");
    if (!menu) return;

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        menu.innerHTML = `
      <li><a href="index.html">HOME</a></li>
      <li><a href="products.html">PRODUCTS</a></li>
      <li><a href="about.html">ABOUT US</a></li>
      <li><a href="contact.html">CONTACT</a></li>
      <li><a href="payment.html">PAYMENT</a></li>
      <li><a href="cart.html">CART</a></li>
      <li><span>Welcome, ${loggedInUser.username}</span></li>
      <li><a href="#" id="logoutBtn">LOGOUT</a></li>
    `;

        // ✅ logout event
        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "index.html";
        });
    }
}
updateNavbar();

// ========== Protect Payment Page ==========
if (window.location.pathname.includes("payment.html")) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("You must be logged in to access the payment page.");
        window.location.href = "login.html";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const paymentForm = document.querySelector("form");
    const paymentMessage = document.getElementById("paymentMessage");

    if (paymentForm) {
        paymentForm.addEventListener("submit", function(e) {
            e.preventDefault(); // يمنع الريفريش

            // إظهار رسالة الدفع
            paymentMessage.textContent = "Payment Successful!";
            paymentMessage.classList.add("show");

            // اختفاء الرسالة بعد 5 ثواني وبعدين يرجع للهوم
            setTimeout(() => {
                paymentMessage.classList.remove("show");
                window.location.href = "index.html"; // يرجع للهوم بعد ما الرسالة تختفي
            }, 3000);
        });
    }

});


document.addEventListener("DOMContentLoaded", function() {
    const cartForm = document.querySelector(".cart-actions form");
    if (cartForm) {
        cartForm.addEventListener("submit", function(e) {
            // هنا بنخلي الفورم يشتغل عادي
            cartForm.submit();
        });
    }
});



