import {SingleAnswer} from './single-answer';
import {ArrayAnswer} from './array-answer';

export class ErrorAnswer<TError> extends SingleAnswer<any> {
    public static isErrorAnswer(answer: SingleAnswer<any> | ArrayAnswer<any>): answer is ErrorAnswer<string> {
        return answer.success === false;
    }

    constructor(
        public readonly error: TError,
    ) {
        super(null, false);
    }
}
