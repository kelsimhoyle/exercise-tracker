

export interface ExerciseInterface {
    description: String;
    duration: Number;
    date: Date;
    _id: String;
}

export interface UserInterface {
    username: String;
    count?: Number;
    log: ExerciseInterface[];
    _id: string;
}

export interface LogResult {
    username: String,
    _id: string,
    log: {
        description: String,
        duration: Number,
        date: String
    }[]
}
