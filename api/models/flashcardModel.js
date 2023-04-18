const db = require("../config/postgresdb");

class Flashcard {
    constructor({
        card_id,
        collection,
        question,
        fact,
        user_id
    }) {
        this.card_id = card_id;
        this.collection = collection;
        this.question = question;
        this.fact = fact;
        this.user_id = user_id;
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM flashcard;");
        if (response.rows.length === 0) {
            throw new Error ("No flashcards available");
        }
        return response.rows.map((f) => new Flashcard(f));
    }

    static async getById(id) {
        const response = await db.query("SELECT * FROM flashcard WHERE card_id = $1;", [id]);
        if (response.rows.length != 1) {
            throw new Error("No flashcards available");
        }
        return new Flashcard(response.rows[0]);
    }

    static async getByUserId(id) {
        const response = await db.query("SELECT * FROM flashcard where user_id = $1;",
        [id]
        )
        if (response.rows.length < 1) {
            throw new Error("No flashcards available")
        }
        return response.rows.map((a) => new Flashcard(a));
    }
    static async getBySubject(subject) {
        const response = await db.query("SELECT * FROM flashcard WHERE collection = $1", [subject]);
        if (response.rows.length === 0) {
            throw new Error("No flashcards available for this subject");
        }
        return response.rows.map((f) => new Flashcard(f));
    }

    static async create(data, user_id) {
        const {collection, question, fact} = data;
        const response = await db.query(
            "INSERT INTO flashcard (collection, question, fact, user_id) VALUES ($1, $2, $3, $4) RETURNING *;",
            [collection, question, fact, user_id]
        );

        return response.rows[0];
    }

    async destroy() {
        let response = await db.query("DELETE FROM flashcard WHERE card_id = $1 RETURNING *;", 
        [this.card_id]);
        return new Flashcard(response.rows[0]);
    }
}

module.exports = Flashcard;