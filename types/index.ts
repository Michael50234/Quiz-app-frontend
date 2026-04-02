// Resource Types
export type User = {
  id: number;
  nickname: string;
  profile_picture_url?: string;
  about_me: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type Quiz = {
  id: number;
  title: string;
  owner: User;
  tags: Tag[];
  is_public: boolean;
  cover_image_url?: string;
  description: string;
  questions: Question[];
};

export type Question = {
  id: number;
  question: string;
  question_image_url?: string;
  choices: Choice[];
};

export type Choice = {
  id: number;
  choice: string;
  is_answer: boolean;
};

export type Submission = {
  id: number;
  submission_time: string;
  score: number;
  number_of_questions: number;
};

// Edit Quiz Types
export type EditChoice = Pick<Choice, "choice" | "is_answer"> & {
  id?: number;
  uid: string;
};

export type EditQuestion = Pick<Question, "question" | "question_image_url"> & {
  uid: string;
  id?: number;
  choices: EditChoice[];
  questionImageBlob?: Blob;
};

export type EditQuiz = Pick<
  Quiz,
  "id" | "title" | "is_public" | "cover_image_url" | "description"
> & {
  tag_ids: number[];
  questions: EditQuestion[];
  coverImageBlob?: Blob;
  owner: Pick<User, "id">;
};

// Create Quiz Types
export type CreateChoice = Pick<Choice, "choice" | "is_answer"> & {
  uid: string;
};

export type CreateQuestion = Pick<
  Question,
  "question" | "question_image_url"
> & {
  id?: number;
  uid: string;
  choices: CreateChoice[];
  questionImageBlob?: Blob;
};

export type CreateQuiz = Pick<
  Quiz,
  "title" | "is_public" | "cover_image_url" | "description"
> & {
  id?: number;
  questions: CreateQuestion[];
  tag_ids: number[];
  coverImageBlob?: Blob;
};

export type CreateSubmission = Pick<
  Submission,
  "score" | "number_of_questions"
> & {
  quiz_id: number;
};

// Display Types
export type DisplayQuiz = Pick<
  Quiz,
  "id" | "title" | "cover_image_url" | "description"
> & {
  owner: Pick<User, "id" | "nickname">;
  tags: { name: string }[];
};

export type DisplayUser = Pick<
  User,
  "id" | "nickname" | "profile_picture_url" | "about_me"
> & {
  profilePictureBlob?: Blob;
};

// Quiz Play Types
export type PlayChoice = Pick<Choice, "id" | "choice">;

export type PlayQuestion = Pick<
  Question,
  "id" | "question" | "question_image_url"
> & {
  choices: PlayChoice[];
};

export type PlayQuiz = Pick<Quiz, "id" | "title" | "cover_image_url"> & {
  owner: Pick<User, "id" | "nickname">;
  questions: PlayQuestion[];
};

// API Response Types
export type ErrorResponse = {
  detail: string;
};

export type CreateQuizResponse = {
  quiz_id: number;
  question_ids: Record<string, number>;
};

export type EditQuizResponse = CreateQuizResponse;

export type CheckChoiceResponse = {
  correct_choice: PlayChoice;
  is_answer: true;
};

//Choices in this quiz have the answer
export type QuizDetailViewResponse = Pick<
  Quiz,
  | "id"
  | "title"
  | "owner"
  | "tags"
  | "cover_image_url"
  | "description"
  | "is_public"
> & {
  tags: { name: string }[];
  questions: QuestionDetailViewResponse[];
};

export type QuestionDetailViewResponse = Pick<
  Question,
  "id" | "question" | "question_image_url"
> & {
  choices: Pick<Choice, "choice" | "id" | "is_answer">[];
};

//Choices in this quiz don't have the answer
export type QuizPlayViewResponse = Pick<
  Quiz,
  | "id"
  | "title"
  | "owner"
  | "tags"
  | "cover_image_url"
  | "description"
  | "is_public"
> & {
  tags: { name: string }[];
  questions: QuestionPlayViewResponse;
};

export type QuestionPlayViewResponse = Pick<
  Quiz,
  "id" | "title" | "owner" | "tags" | "cover_image_url" | "description"
> & {
  choices: Pick<Choice, "choice" | "id">[];
};

// Get Submissions Response Format (return format for get all submissions route)
export type SubmissionResponse = Pick<
  Submission,
  "submission_time" | "score" | "number_of_questions"
> & {
  id: number;
  quiz_title: string;
  user: Pick<User, "id" | "nickname">;
};

// Query parameters object for display pages filtering
export type QueryParameters = {
  tag_ids?: number[];
  name?: string;
  page?: number;
};

export type SnackbarState = {
  open: boolean;
  message: string;
  retry: (() => void) | null;
};
