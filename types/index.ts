type User = {
    id: number
    nickname: string,
    profile_picture_url: string,
    about_me: string
};

type Tag = {
    id: number,
    name: string,
};


type Quiz = {
    id: number
    title: string,
    owner: User,
    tags: Tag[],
    is_public: boolean,
    cover_image_url: string,
    description: string,
};

type Question = {
    id: number,
    question: string,
    question_image_url: string
};

type Choice = {
    id: number,
    choice: string,
    is_answer: boolean
};

type Submission = {
    id: number
    submission_time: string,
    score: number,
    number_of_questions: number
};

//Editing Types

type EditChoice = Pick<Choice, 'id' | 'choice' | 'is_answer'>


type EditQuestion = Pick<Question, "question" | "question_image_url"> & {
    id?: number,
    choices: EditChoice[]
};

type EditQuiz = Pick<Quiz, "title" | "is_public" | "cover_image_url" | "description"> & {
    tag_ids: number[],
    questions: EditQuestion[]
};

//Creating Types

type CreateChoice = Pick<Choice, "choice" | "is_answer">;

type CreateQuestion = Pick<Question, "question" | "question_image_url"> & {
    choices: CreateChoice[]
};

type CreateQuiz = Pick<Quiz, "title" | "is_public" | "cover_image_url" | "description"> & {
    questions: CreateQuestion[],
    tag_ids: number[]
};


type CreateSubmission = Pick<Submission, "score" | "number_of_questions"> & {
    quiz_id: number
};

//Check Types

type CheckChoice = Pick<Choice, "id" | "choice">;

//API Response Types

//Display Types
type QuizDisplay = Pick<Quiz, "id" | "title" | "cover_image_url" | "description"> & {
    owner: Pick<User, "id" | "nickname">
    tags: {name: string}[]
};

//Quiz Play Types
type ChoicePlay = Pick<Choice, "id" | "choice">;

type QuestionPlay = Pick<Question, "question" | "question_image_url"> & {
    choices: ChoicePlay[]
};

type QuizPlay = Pick<Quiz, "id" | "title"> & {
    owner: Pick<User, "id" | "nickname">,
    questions: QuestionPlay[],
    tags: {name: string}[]
};

//Submission Return Format

type SubmissionReturn = Pick<Submission, "submission_time" | "score" | "number_of_questions"> & {
    quiz_title: string,
    user: Pick<User, "id" | "nickname">
}