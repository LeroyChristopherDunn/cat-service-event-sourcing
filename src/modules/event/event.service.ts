import { Injectable } from '@nestjs/common';
import { EventQueryDto } from './dto/event-query.dto';
import { EventCreateDto } from './dto/event-create.dto';
import { HttpService } from '@nestjs/axios';
import { EVENT_STORE_URL } from '../../config';
import { Event } from './dto/event.dto';
import { Paginated } from '../../pagination.utils';

const RESOURCE_URL = EVENT_STORE_URL + '/event';

@Injectable()
export class EventService {
  constructor(private readonly httpService: HttpService) {}

  async create(event: EventCreateDto): Promise<Event> {
    return this.httpService.axiosRef
      .post(RESOURCE_URL, event)
      .then((response) => response.data as Event);
  }

  async find(id: number): Promise<Event> {
    return this.httpService.axiosRef
      .get(`${RESOURCE_URL}/${id}`)
      .then((response) => response.data as Event);
  }

  async findAll(query?: EventQueryDto): Promise<Paginated<Event>> {
    return this.httpService.axiosRef
      .get(RESOURCE_URL, {
        params: query,
      })
      .then((response) => response.data as Paginated<Event>);
  }

  async healthCheck(): Promise<void> {
    return this.httpService.axiosRef
      .get(`${EVENT_STORE_URL}`)
      .then(() => undefined);
  }
}
