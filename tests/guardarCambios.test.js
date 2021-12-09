test('Se valida el metodo guardarCambios', async () => {

	fetch('http://localhost:3001/servicioPagos/boletosApartados', {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: {
			numero: 5,
			comprobantePago: 'test.png',
			estadoBoleto: 'APARTADO'
		}
	})
		.then(res => {
			expect(res.statusCode).toBe(200);
		})
		.catch(err => {
			console.log(err.message);

		});

})

test('Se valida el metodo guardarCambios fallido', async () => {

	fetch('http://localhost:3001/servicioPagos/boletosApartados', {
		method: 'PUT'
	})
		.then(res => {

		})
		.catch(err => {
			expect(res.statusCode).toBe(500);

		});

})