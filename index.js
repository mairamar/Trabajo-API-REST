import express from 'express';
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    }   catch (error) {
        console.log(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    }   catch (error) {
        console.log(error);
    }
};

app.get("/", (req, res) => {
    res.send("Bienvenidos empleados");
});

app.get("/empleados", (req, res) => {
    const data = readData();
    res.json(data.empleados);
});

app.get("/empleados/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const empleados = data.empleados.find((empleados) => empleados.id === id);
    res.json(empleados);
});

app.post("/empleados", (req, res) => {
    const data = readData();
    const body = req.body;
    const newEmpleados = {
        id: data.empleados.length + 1,
        ... body,
    };
    data.empleados.push(newEmpleados);
    writeData(data);
    res.json(newEmpleados);
});

app.put("/empleados/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const empleadosIndex = data.empleados.findIndex((empleados) => empleados.id === id);
    data.empleados[empleadosIndex] = {
        ...data.empleados[empleadosIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "empleado actualizado correctamente" });
});

app.delete("/empleados/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const empleadosIndex = data.empleados.findIndex((empleados) => empleados.id === id);
    data.empleados.splice(empleadosIndex, 1);
    writeData(data);
    res.json({ message: "empleado eliminado correctamente" });
});

app.listen(3000, () => {
    console.log("server escuchando el puerto 3000");
});