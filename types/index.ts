// Resource Types
export type User = {
    id: number
    nickname: string,
    profile_picture_url: string,
    about_me: string
};

export type Tag = {
    id: number,
    name: string,
};


export type Quiz = {
    id: number
    title: string,
    owner: User,
    tags: Tag[],
    is_public: boolean,
    cover_image_url?: string,
    description: string,
};

export type Question = {
    id: number,
    question: string,
    question_image_url?: string
};

export type Choice = {
    id: number,
    choice: string,
    is_answer: boolean
};

export type Submission = {
    id: number
    submission_time: string,
    score: number,
    number_of_questions: number
};

// Edit Quiz Types
export type EditChoice = Pick<Choice, 'choice' | 'is_answer'> & {
    id?: string,
    uid: string
}


export type EditQuestion = Pick<Question, "question" | "question_image_url"> & {
    uid: string,
    id?: number,
    choices: EditChoice[],
    questionImageBlob?: Blob
};

export type EditQuiz = Pick<Quiz, "title" | "is_public" | "cover_image_url" | "description"> & {
    id: number
    tag_ids: number[],
    questions: EditQuestion[],
    coverImageBlob?: Blob
};

// Create Quiz Types
export type CreateChoice = Pick<Choice, "choice" | "is_answer"> & {
    uid: string
};

export type CreateQuestion = Pick<Question, "question" | "question_image_url"> & {
    id?: number,
    uid: string,
    choices: CreateChoice[],
    questionImageBlob?: Blob
};

export type CreateQuiz = Pick<Quiz, "title" | "is_public" | "cover_image_url" | "description"> & {
    id?: number
    questions: CreateQuestion[],
    tag_ids: number[],
    coverImageBlob?: Blob
};


export type CreateSubmission = Pick<Submission, "score" | "number_of_questions"> & {
    quiz_id: number
};

// Check Types
export type CheckChoice = Pick<Choice, "id" | "choice">;

// Display Types
export type QuizDisplay = Pick<Quiz, "id" | "title" | "cover_image_url" | "description"> & {
    owner: Pick<User, "id" | "nickname">
    tags: {name: string}[]
};

// Quiz Play Types
export type ChoicePlay = Pick<Choice, "id" | "choice">;

export type QuestionPlay = Pick<Question, "question" | "question_image_url"> & {
    choices: ChoicePlay[]
};

export type QuizPlay = Pick<Quiz, "id" | "title"> & {
    owner: Pick<User, "id" | "nickname">,
    questions: QuestionPlay[],
    tags: {name: string}[]
};

// API Response Types

export type CreateQuizResponse = {
    quiz_id: number,
    question_ids: Record<string, number>,
};

export type EditQuizResponse = CreateQuizResponse;

export type QuizDetailViewResponse = Pick<Quiz, "id" | "title" | "owner" | "tags" | "cover_image_url" | "description"> & {
    tags: { name: string },
    questions: QuestionDetailViewResponse[]
}

export type QuestionDetailViewResponse = Pick<Question, "id" | "question" | "question_image_url"> & {
    choices: Pick<Choice, "choice" | "id">
}

// Get Submissions Response Format (return format for get all submissions route)
export type SubmissionResponse = Pick<Submission, "submission_time" | "score" | "number_of_questions"> & {
    quiz_title: string,
    user: Pick<User, "id" | "nickname">
}


// Query parameters object for display pages filtering
export type QueryParameters = {
    tag_ids?: number[],
    name?: string,
    page?: number
}