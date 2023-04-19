import React, { useEffect, useState } from "react";
import { QuizQuestion } from "../../components";
import styles from "./index.module.css"
import { useParams } from "react-router-dom";

export default function Quizzes() {
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const { subject } = useParams()

  async function getQuestions() {
    const category = subject[0].toUpperCase() + subject.substring(1)
    const response = await fetch(`http://localhost:8080/quiz/${category}%20GCSE`)
    const data = await response.json()
 
    setQuestions(data.sort(() => Math.random() - 0.5).splice(0, 10))
    setLoading(false)
  }

  useEffect(() => {
    getQuestions()
    
  }, [])

  async function updateScore(id, score, score_out_of) {
    const options = {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },    
      body: JSON.stringify({
        score: score,
        score_out_of: score_out_of
      })
    }
    const response = await fetch(`http://localhost:8080/users/${id}`, options)
    await response.json()
  }


  function displayQuestion() {
    return (
      <div className={styles["container"]}>
          <h1 className={styles["title"]}>Quizzes</h1>
        <QuizQuestion questions={questions} updateScore={updateScore}/>
      </div>
    )
  }

  return loading ? <h2><em>loading...</em></h2> : displayQuestion();


}