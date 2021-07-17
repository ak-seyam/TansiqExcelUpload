import {Server} from "http";
import express from "express";
import PingRouter from "../../../routes/ping";
import axios from "axios";
describe("Pinging the server", () => {
  const PORT = Math.floor((Math.random() + 0.1) * 10000);
	let server : Server;
	beforeAll(() => {
		const app = express()
		app.use(PingRouter);
		server = app.listen(PORT)
	})
	afterAll(() => {
		server.close()
	})

	test('should return pong to ping', async () => {
		const data = await axios.get(`http://localhost:${PORT}/ping`).then(res => res.data);
		expect(data).toEqual("pong");
	})
	
});
