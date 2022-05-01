const dbConnection = require("../config/mongoConnection");


async function main() {
    const db = await dbConnection.connectToDb();

    db.collection("users").drop();
    db.collection("shows").drop();
    db.collection("reviews").drop();

    await dbConnection.closeConnection();
}

main().catch((error) => {
    console.log(error);
});