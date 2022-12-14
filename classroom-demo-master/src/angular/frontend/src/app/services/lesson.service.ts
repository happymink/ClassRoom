import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Lesson } from '../models/lesson';
import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';


@Injectable()
export class LessonService {

    private url = 'api-lessons';

    constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

    getLessons(user: User) {
        return this.http.get(this.url + '/user/' + user.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.authenticationService.token
            }
        }).pipe(
            map((response: Response) => response as unknown as Lesson[]),
            catchError(error => this.handleError(error))
        );
    }

    getLesson(lessonId: number) {
        return this.http.get(this.url + '/lesson/' + lessonId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.authenticationService.token
            }
        }).pipe(
            map((response: Response) => response),
            catchError(error => this.handleError(error))
        );
    }

    // POST new lesson. On success returns the created lesson
    newLesson(lesson: Lesson) {
        const body = JSON.stringify(lesson);
        return this.http.post(this.url + '/new', body, {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).pipe(
            map(response => response as Lesson),
            catchError(error => this.handleError(error))
        );
    }

    // PUT existing lesson. On success returns the updated lesson
    editLesson(lesson: Lesson) {
        const body = JSON.stringify(lesson);
        return this.http.put(this.url + '/edit', body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.authenticationService.token
            }
        }).pipe(
            map(response => response as Lesson),
            catchError(error => this.handleError(error))
        );
    }

    // DELETE existing lesson. On success returns the deleted lesson (simplified version)
    deleteLesson(lessonId: number) {
        return this.http.delete(this.url + '/delete/' + lessonId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.authenticationService.token
            }
        }).pipe(
            map(response => response as Lesson),
            catchError(error => this.handleError(error))
        );
    }

    // PUT existing lesson, modifying its attenders (adding them). On success returns the updated lesson.attenders array
    addLessonAttenders(lessonId: number, userEmails: string[]) {
        const body = JSON.stringify(userEmails);
        return this.http.put(this.url + '/edit/add-attenders/lesson/' + lessonId, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.authenticationService.token
            }
        }).pipe(
            map(response => response),
            catchError(error => this.handleError(error))
        );
    }

    // PUT existing lesson, modifying its attenders (deleting them). On success returns the updated lesson.attenders array
    deleteLessonAttenders(lesson: Lesson) {
        const body = JSON.stringify(lesson);
        return this.http.put(this.url + '/edit/delete-attenders', body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.authenticationService.token
            }
        }).pipe(
            map(response => response as User[]),
            catchError(error => this.handleError(error))
        );
    }

    obtainLocalLesson(id: number) {
        return this.authenticationService.getCurrentUser().lessons.find(lesson => lesson.id === id);
    }

    private handleError(error: any) {
        console.error(error);
        return observableThrowError('Server error (' + error.status + '): ' + error.text())
    }
}
