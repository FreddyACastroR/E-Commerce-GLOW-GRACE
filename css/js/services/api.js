const API_URL = "https://dummyjson.com";

export async function obtenerProductos() {
    try {
        const response = await fetch(`${API_URL}/products/category/beauty`);

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.products;

    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
}

export async function sendCheckout(cartData) {
    try {
        const response = await fetch(`${API_URL}/carts/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: 1,
                products: cartData.map(item => ({
                    id: item.id,
                    quantity: item.quantity
                }))
            })
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();

    } catch (error) {
        console.error("Error al enviar checkout:", error);
        return null;
    }
}
