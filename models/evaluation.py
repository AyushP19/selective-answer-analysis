def evaluate_answer(grammar_mistakes, similarity_score):
    """
    Calculates the final score based on:
    - Grammar penalty (5 points per mistake)
    - Similarity boost (scaled)
    
    Returns final score and a remark.
    """

    # Scoring formula
    penalty = grammar_mistakes * 5           
    similarity_boost = similarity_score * 0.5  
    raw_score = 100 - penalty + similarity_boost
    final_score = max(0, min(raw_score, 100))  

    # Generate remark based on performance
    if final_score >= 90:
        remark = "Excellent! Your answer is well-written and highly accurate."
    elif final_score >= 75:
        remark = "Great job! Just a few improvements needed."
    elif final_score >= 60:
        remark = "Good effort! Focus more on grammar and content alignment."
    elif final_score >= 40:
        remark = "Needs improvement. Check grammar and try to match the expected content better."
    else:
        remark = "Poor performance. Please review the topic and try again."

    return round(final_score, 2), remark
