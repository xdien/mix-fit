import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import type { AbstractWithIdDto } from '../common/dto/abstract-with-id.dto';
import { TranslationService } from '../shared/services/translation.service';

// FIXME: add implementation
@Injectable()
export class TranslationInterceptor implements NestInterceptor {
  constructor(private readonly translationService: TranslationService) {}

  public intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<AbstractWithIdDto> {
    return next
      .handle()
      .pipe(
        mergeMap((data) =>
          this.translationService.translateNecessaryKeys(data),
        ),
      );
  }
}
