const API_URL = "https://dummyjson.com";

export async function obtenerProductos(){
    try {
        // https://dummyjson.com/products/category/beauty
        const response = await fetch(`${API_URL}/products/category/beauty`);
        
        if(!response.ok){
            return [];
        }
        
        const data = await response.json();
        
        return data.products;
        
    } catch (error) {
        return [];
    }
}

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
            alert("Ocurrió un error al guardar el carrito");
            return null;
        }

        return await response.json();

    } catch (error) {
        alert("Ocurrió un error al guardar el carrito");
        return null;
    }
}