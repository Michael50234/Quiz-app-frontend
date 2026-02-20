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
    cover_image_url: string,
    description: string,
};

export type Question = {
    id: number,
    question: string,
    question_image_url: string
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

//Editing Types

export type EditChoice = Pick<Choice, 'id' | 'choice' | 'is_answer'>


export type EditQuestion = Pick<Question, "question" | "question_image_url"> & {
    id?: number,
    choices: EditChoice[]
};

export type EditQuiz = Pick<Quiz, "title" | "is_public" | "cover_image_url" | "description"> & {
    tag_ids: number[],
    questions: EditQuestion[]
};

//Creating Types

export type CreateChoice = Pick<Choice, "choice" | "is_answer">;

export type CreateQuestion = Pick<Question, "question" | "question_image_url"> & {
    choices: CreateChoice[]
};

export type CreateQuiz = Pick<Quiz, "title" | "is_public" | "cover_image_url" | "description"> & {
    questions: CreateQuestion[],
    tag_ids: number[]
};


export type CreateSubmission = Pick<Submission, "score" | "number_of_questions"> & {
    quiz_id: number
};

//Check Types

export type CheckChoice = Pick<Choice, "id" | "choice">;

//API Response Types

//Display Types
export type QuizDisplay = Pick<Quiz, "id" | "title" | "cover_image_url" | "description"> & {
    owner: Pick<User, "id" | "nickname">
    tags: {name: string}[]
};

//Quiz Play Types
export type ChoicePlay = Pick<Choice, "id" | "choice">;

export type QuestionPlay = Pick<Question, "question" | "question_image_url"> & {
    choices: ChoicePlay[]
};

export type QuizPlay = Pick<Quiz, "id" | "title"> & {
    owner: Pick<User, "id" | "nickname">,
    questions: QuestionPlay[],
    tags: {name: string}[]
};

//Submission Return Format

export type SubmissionReturn = Pick<Submission, "submission_time" | "score" | "number_of_questions"> & {
    quiz_title: string,
    user: Pick<User, "id" | "nickname">
}