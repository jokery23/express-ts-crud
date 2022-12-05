import { GetUsersResponseDto } from '../types/get-users-response.dto';

export const getUser = (id: number): GetUsersResponseDto => {
  const response: GetUsersResponseDto = new GetUsersResponseDto();

  return response;
}