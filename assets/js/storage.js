(function () {
  "use strict";

  const KEY = "gymcore-prototype-v1";

  window.GymStorage = {
    clone(value) {
      return JSON.parse(JSON.stringify(value));
    },
    load() {
      try {
        const saved = localStorage.getItem(KEY);
        return saved ? JSON.parse(saved) : this.clone(window.GYM_SEED);
      } catch {
        return this.clone(window.GYM_SEED);
      }
    },
    save(data) {
      localStorage.setItem(KEY, JSON.stringify(data));
    },
    reset() {
      const data = this.clone(window.GYM_SEED);
      this.save(data);
      return data;
    }
  };
})();
