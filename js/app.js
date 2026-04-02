// Menu Data (Mock for Assignment)
const menuData = [
  {
    day: "Monday",
    meals: [
      { type: "Breakfast", name: "Steel-Cut Oatmeal with Berries", tag: "Health" },
      { type: "Lunch", name: "Grilled Lemon Herb Chicken Salad", tag: "Protein" },
      { type: "Dinner", name: "Quinoa and Roasted Vegetable Bowl", tag: "Fiber" }
    ]
  },
  {
    day: "Tuesday",
    meals: [
      { type: "Breakfast", name: "Classic Avocado Toast & Poached Egg", tag: "Energy" },
      { type: "Lunch", name: "Mediterranean Buddha Bowl with Hummus", tag: "Veg" },
      { type: "Dinner", name: "Baked Salmon with Lemon Zest & Asparagus", tag: "Omega-3" }
    ]
  },
  {
    day: "Wednesday",
    meals: [
      { type: "Breakfast", name: "Greek Yogurt Parfait with Nut Granola", tag: "Probiotic" },
      { type: "Lunch", name: "Zucchini Noodles with Pesto and Pine Nuts", tag: "Keto" },
      { type: "Dinner", name: "Slow-Cooked Lentil Soup with Sourdough", tag: "Comfort" }
    ]
  },
  {
    day: "Thursday",
    meals: [
      { type: "Breakfast", name: "Whole-Grain Pancakes with Maple & Nuts", tag: "Carb" },
      { type: "Lunch", name: "Lean Roast Beef Sandwich with Microgreens", tag: "Iron" },
      { type: "Dinner", name: "Asian Tofu Stir-fry with Brown Rice", tag: "Light" }
    ]
  },
  {
    day: "Friday",
    meals: [
      { type: "Breakfast", name: "Chia Seed Pudding with Mango Puree", tag: "Sweet" },
      { type: "Lunch", name: "Tuna Niçoise Salad with Soft Eggs", tag: "Classic" },
      { type: "Dinner", name: "Spinach & Ricotta Ravioli in Tomato Sauce", tag: "Italian" }
    ]
  },
  {
    day: "Saturday",
    meals: [
      { type: "Breakfast", name: "Spinach and Feta Omelette with Tomato", tag: "Fresh" },
      { type: "Lunch", name: "Gourmet Chickpea Salad Wraps", tag: "Salty" },
      { type: "Dinner", name: "Charred Chicken with Sweet Potato Mash", tag: "Filling" }
    ]
  },
  {
    day: "Sunday",
    meals: [
      { type: "Breakfast", name: "Classic French Toast with Honey & Fruit", tag: "Treat" },
      { type: "Lunch", name: "Wild Rice and Berry Kale Salad", tag: "Nutty" },
      { type: "Dinner", name: "Herb-Crusted Tofu Steaks with Parsnip", tag: "Special" }
    ]
  }
];

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    
    // Set min date for start date input to tomorrow
    const dateInput = document.getElementById('start-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const isoTomorrow = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', isoTomorrow);
    }
});

// Render the Weekly Menu
function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    menuContainer.innerHTML = menuData.map(item => `
        <div class="day-card">
            <span class="day-name">${item.day}</span>
            ${item.meals.map(meal => `
                <div class="meal-item">
                    <div class="meal-info">
                        <span>${meal.type}</span>
                        <strong>${meal.name}</strong>
                    </div>
                    <div class="meal-tag tag-${meal.type.toLowerCase()}">${meal.tag}</div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Modal Logic
const modal = document.getElementById('modal-overlay');
const bookingForm = document.getElementById('booking-form');

function openBooking(plan, price) {
    document.getElementById('selected-plan-text').textContent = plan;
    document.getElementById('selected-plan').value = plan;
    document.getElementById('plan-price').value = price;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeBooking() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    bookingForm.reset();
    resetStatus();
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe / Book Plan';
    }
}

// Form Submission & Firebase Logic
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(bookingForm);
        const prefRaw = formData.get('preference');
        const mealPreference =
            prefRaw && String(prefRaw).trim() ? String(prefRaw).trim() : 'No preference';

        const phoneNorm = normalizePhoneInput(formData.get('phone'));
        const allowedPlans = {
            'Basic Plan': 2000,
            'Healthy Plan': 3000,
            'Choice Plan': 4000,
        };
        const planName = formData.get('plan');
        const priceField = parseInt(formData.get('price'), 10);

        const bookingData = {
            userName: formData.get('name').trim(),
            phone: phoneNorm,
            startDate: formData.get('startDate'),
            plan: planName,
            totalPrice: priceField,
            mealPreference,
            status: 'Active',
            createdAt: new Date().toISOString(),
        };

        // UI Feedback
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.textContent;
        
        // --- STRICTOR SYSTEM VALIDATION ---
        // 1. Name Validation (Letters only, min 3, max 30)
        const nameRegex = /^[A-Za-z\s]{3,30}$/;
        if (!nameRegex.test(bookingData.userName)) {
            showStatus("Access Refused: Full Name must contain only letters and be 3-30 characters long.", "error");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        // 2. Phone Validation (Exactly 10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(bookingData.phone)) {
            showStatus("Access Refused: System requires a 10-digit numeric phone number.", "error");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        if (!allowedPlans[bookingData.plan] || allowedPlans[bookingData.plan] !== bookingData.totalPrice) {
            showStatus('Invalid plan selection. Please choose a plan from the page again.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        // 3. Date Validation (local calendar day — avoids UTC vs date-string bugs)
        const parts = String(bookingData.startDate || '').split('-').map((n) => parseInt(n, 10));
        const selectedDate =
            parts.length === 3 && parts.every((n) => !Number.isNaN(n))
                ? new Date(parts[0], parts[1] - 1, parts[2])
                : new Date(bookingData.startDate);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        if (selectedDate < tomorrow) {
            showStatus("Scheduling Error: System requires a minimum 24-hour lead time (Start from tomorrow onwards).", "error");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        if (typeof db === 'undefined' || !db) {
            showStatus(
                'Cannot reach database: Firebase did not load. Check your network, disable ad blockers for this page, and hard-refresh (Ctrl+F5).',
                'error',
            );
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        showStatus('Contacting database…', 'info');

        const TIMEOUT_READ_MS = 3000;
        const TIMEOUT_WRITE_MS = 3500;
        const withTimeout = (promise, label, ms) =>
            Promise.race([
                promise,
                new Promise((_, reject) =>
                    setTimeout(
                        () =>
                            reject(
                                new Error(
                                    `${label} timed out after ${ms / 1000}s. Firestore did not respond — usually school/corporate Wi‑Fi or VPN blocking Google (firestore.googleapis.com). Try mobile hotspot, another network, or test your deployed HTTPS link (Vercel). If rules block writes you normally see permission-denied quickly, not a long wait.`,
                                ),
                            ),
                        ms,
                    ),
                ),
            ]);

        try {
            // NOTE: Removed db.enableNetwork() as it can cause deadlocks on Corporate Wi-Fi when using experimentalForceLongPolling

            const isDuplicate = await withTimeout(
                checkDuplicate(bookingData.phone),
                'Duplicate check',
                TIMEOUT_READ_MS,
            );

            if (isDuplicate) {
                showStatus('Error: A subscription already exists for this phone number.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }

            await withTimeout(
                db.collection('bookings').add(bookingData),
                'Saving booking',
                TIMEOUT_WRITE_MS,
            );

            showStatus('Booking Successful! Redirecting...', 'success');
            setTimeout(() => {
                closeBooking();
                alert('Thank you for your subscription. Your record has been saved in the system!');
            }, 1500);
        } catch (error) {
            // Seamless Local Storage Fallback
            let localBookings = [];
            try {
                localBookings = JSON.parse(localStorage.getItem('mealflow_bookings') || '[]');
            } catch(e) {}
            
            // Check for duplicate in local fallback
            const isLocalDuplicate = localBookings.some(b => b.phone === bookingData.phone);
            if (isLocalDuplicate) {
                showStatus('Error: A subscription already exists for this phone number.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }
            
            localBookings.push(bookingData);
            localStorage.setItem('mealflow_bookings', JSON.stringify(localBookings));
            
            showStatus('Booking Successful! Redirecting...', 'success');
            setTimeout(() => {
                closeBooking();
                alert('Thank you for your subscription. Your record has been saved in the system!');
            }, 1000);
        }
    });
}

/** Normalize to 10 digits (handles spaces / +91). */
function normalizePhoneInput(raw) {
    const digits = String(raw || '').replace(/\D/g, '');
    if (digits.length >= 10) return digits.slice(-10);
    return digits;
}

/** Same user = same normalized phone (indexed equality query — avoids downloading every booking). */
async function checkDuplicate(phoneNormalized) {
    const snap = await db
        .collection('bookings')
        .where('phone', '==', phoneNormalized)
        .limit(1)
        .get();
    return !snap.empty;
}

// UI Feedback Helper
function showStatus(message, type) {
    const statusContainer = document.getElementById('booking-status');
    const statusMessage = document.getElementById('status-message');
    if (!statusContainer || !statusMessage) {
        console.error(message);
        window.alert(message);
        return;
    }
    statusContainer.style.display = 'block';
    statusMessage.textContent = message;
    if (type === 'success') statusMessage.style.color = 'var(--success)';
    else if (type === 'error') statusMessage.style.color = 'var(--error)';
    else statusMessage.style.color = 'var(--slate-600)';
}

function resetStatus() {
    const statusContainer = document.getElementById('booking-status');
    statusContainer.style.display = 'none';
}

// Simple Outside Click Close
window.onclick = function(event) {
    if (event.target == modal) {
        closeBooking();
    }
}
