function encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function decode(b64) {
    return decodeURIComponent(escape(atob(b64)));
}

export class CarritoStorage {
    constructor(key = "cart") {
        this.key = key;
    }

    setCarrito(carrito) {
        const jsonString = JSON.stringify(carrito);
        localStorage.setItem(this.key, encode(jsonString));
    }

    getCarrito() {
        const raw = localStorage.getItem(this.key);
        if (!raw) return [];

        try {
            return JSON.parse(decode(raw));
        } catch (error) {
            console.warn("Carrito corrupto en LocalStorage, se reinicia.", error);
            localStorage.removeItem(this.key);
            return [];
        }
    }
}

export const storage = new CarritoStorage();
