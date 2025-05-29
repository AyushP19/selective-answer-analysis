def evaluate_answer(grammar_mistakes, similarity_score):
    """
    Calculates final score based on:
    - Similarity (80% weight)
    - Grammar (20% weight, minus 2 marks per mistake)
    """

    # Step 1: Ensure similarity_score is in range 0.0 - 1.0
    if similarity_score > 1.0:  # It's likely a percentage like 32.89, so convert it
        similarity_score = similarity_score / 100.0

    # Step 2: Calculate score components
    similarity_marks = similarity_score * 80  # Max 80 marks from similarity
    grammar_marks = max(0, 20 - (grammar_mistakes * 2))  # Lose 2 marks per mistake

    # Step 3: Combine and clamp
    final_score = similarity_marks + grammar_marks
    final_score = round(min(100, max(0, final_score)), 2)

    # Step 4: Remark
    if final_score >= 90:
        remark = "Excellent! Your answer is well-written and highly accurate."
    elif final_score >= 75:
        remark = "Great job! Just a few improvements needed."
    elif final_score >= 60:
        remark = "Good effort! Focus more on grammar and content alignment."
    elif final_score >= 40:
        remark = "Needs improvement. Improve grammar and content relevance."
    else:
        remark = "Poor performance. Please review the topic and try again."

    return final_score, remark
