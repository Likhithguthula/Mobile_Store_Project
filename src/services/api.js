import axios from "axios";
import initialData from "../../db.json";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 3000,
});

const STORAGE_KEY_MOBILES = "electromob_mobiles_data";
const STORAGE_KEY_REVIEWS = "electromob_reviews_data";

// Helper to initialize local storage from db.json if not present
const getLocalData = () => {
  try {
    let mobiles = JSON.parse(localStorage.getItem(STORAGE_KEY_MOBILES));
    let reviews = JSON.parse(localStorage.getItem(STORAGE_KEY_REVIEWS));

    if (!mobiles || !Array.isArray(mobiles) || mobiles.length === 0) {
      mobiles = initialData.mobiles || [];
      localStorage.setItem(STORAGE_KEY_MOBILES, JSON.stringify(mobiles));
    }
    if (!reviews || !Array.isArray(reviews)) {
      reviews = initialData.reviews || [];
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    }
    return { mobiles, reviews };
  } catch {
    return { mobiles: initialData.mobiles || [], reviews: initialData.reviews || [] };
  }
};

export const mobileService = {
  // Fetch all mobiles with optional filters
  async getAll(params = {}) {
    try {
      const response = await api.get("/mobiles", { params });
      // Keep local storage synchronized
      localStorage.setItem(STORAGE_KEY_MOBILES, JSON.stringify(response.data));
      return response.data;
    } catch {
      console.info("Using local database cache for mobiles");
      let { mobiles } = getLocalData();

      // Apply search / filter locally if provided
      if (params.q) {
        const query = params.q.toLowerCase();
        mobiles = mobiles.filter(
          (m) =>
            m.name.toLowerCase().includes(query) ||
            m.brand.toLowerCase().includes(query) ||
            m.processor?.toLowerCase().includes(query)
        );
      }
      if (params.brand && params.brand !== "All") {
        mobiles = mobiles.filter((m) => m.brand.toLowerCase() === params.brand.toLowerCase());
      }
      return mobiles;
    }
  },

  // Fetch single mobile by ID
  async getById(id) {
    try {
      const response = await api.get(`/mobiles/${id}`);
      return response.data;
    } catch {
      console.info(`Using local database cache for mobile #${id}`);
      const { mobiles } = getLocalData();
      const found = mobiles.find((m) => String(m.id) === String(id));
      if (!found) throw new Error("Mobile not found");
      return found;
    }
  },

  // Create new mobile
  async create(mobileData) {
    const newMobile = {
      ...mobileData,
      id: mobileData.id || String(Date.now()),
      rating: Number(mobileData.rating) || 4.5,
      price: Number(mobileData.price) || 0,
      originalPrice: Number(mobileData.originalPrice) || Number(mobileData.price) || 0,
      inStock: mobileData.inStock !== false,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await api.post("/mobiles", newMobile);
      const { mobiles } = getLocalData();
      mobiles.unshift(response.data);
      localStorage.setItem(STORAGE_KEY_MOBILES, JSON.stringify(mobiles));
      return response.data;
    } catch {
      const { mobiles } = getLocalData();
      mobiles.unshift(newMobile);
      localStorage.setItem(STORAGE_KEY_MOBILES, JSON.stringify(mobiles));
      return newMobile;
    }
  },

  // Update existing mobile
  async update(id, mobileData) {
    const updated = {
      ...mobileData,
      id: String(id),
      price: Number(mobileData.price) || 0,
      originalPrice: Number(mobileData.originalPrice) || Number(mobileData.price) || 0,
      rating: Number(mobileData.rating) || 4.5,
    };

    try {
      const response = await api.put(`/mobiles/${id}`, updated);
      const { mobiles } = getLocalData();
      const idx = mobiles.findIndex((m) => String(m.id) === String(id));
      if (idx !== -1) {
        mobiles[idx] = response.data;
        localStorage.setItem(STORAGE_KEY_MOBILES, JSON.stringify(mobiles));
      }
      return response.data;
    } catch {
      const { mobiles } = getLocalData();
      const idx = mobiles.findIndex((m) => String(m.id) === String(id));
      if (idx !== -1) {
        mobiles[idx] = updated;
        localStorage.setItem(STORAGE_KEY_MOBILES, JSON.stringify(mobiles));
      }
      return updated;
    }
  },

  // Delete mobile
  async delete(id) {
    try {
      await api.delete(`/mobiles/${id}`);
    } catch {
      console.info(`Deleting mobile #${id} from local cache`);
    }
    const { mobiles } = getLocalData();
    const filtered = mobiles.filter((m) => String(m.id) !== String(id));
    localStorage.setItem(STORAGE_KEY_MOBILES, JSON.stringify(filtered));
    return true;
  },

  // Get reviews for a mobile
  async getReviews(mobileId) {
    try {
      const response = await api.get(`/reviews`, { params: { mobileId } });
      return response.data;
    } catch {
      const { reviews } = getLocalData();
      return reviews.filter((r) => String(r.mobileId) === String(mobileId));
    }
  },

  // Add review
  async addReview(reviewData) {
    const newReview = {
      ...reviewData,
      id: String(Date.now()),
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await api.post("/reviews", newReview);
      const { reviews } = getLocalData();
      reviews.unshift(response.data);
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
      return response.data;
    } catch {
      const { reviews } = getLocalData();
      reviews.unshift(newReview);
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
      return newReview;
    }
  },
};

export default api;
