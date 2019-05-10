import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IPost } from 'app/shared/model/consumer/post.model';
import { PostService } from './post.service';
import { IBlog } from 'app/shared/model/consumer/blog.model';
import { BlogService } from 'app/entities/consumer/blog';
import { ITag } from 'app/shared/model/consumer/tag.model';
import { TagService } from 'app/entities/consumer/tag';

@Component({
    selector: 'jhi-post-update',
    templateUrl: './post-update.component.html'
})
export class PostUpdateComponent implements OnInit {
    post: IPost;
    isSaving: boolean;

    blogs: IBlog[];

    tags: ITag[];
    date: string;

    constructor(
        protected dataUtils: JhiDataUtils,
        protected jhiAlertService: JhiAlertService,
        protected postService: PostService,
        protected blogService: BlogService,
        protected tagService: TagService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ post }) => {
            this.post = post;
            this.date = this.post.date != null ? this.post.date.format(DATE_TIME_FORMAT) : null;
        });
        this.blogService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IBlog[]>) => mayBeOk.ok),
                map((response: HttpResponse<IBlog[]>) => response.body)
            )
            .subscribe((res: IBlog[]) => (this.blogs = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.tagService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITag[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITag[]>) => response.body)
            )
            .subscribe((res: ITag[]) => (this.tags = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.post.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
        if (this.post.id !== undefined) {
            this.subscribeToSaveResponse(this.postService.update(this.post));
        } else {
            this.subscribeToSaveResponse(this.postService.create(this.post));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>) {
        result.subscribe((res: HttpResponse<IPost>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackBlogById(index: number, item: IBlog) {
        return item.id;
    }

    trackTagById(index: number, item: ITag) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}