import { GetUsersResponseDto } from '../types/get-users-response.dto';


export const getUsers = (): GetUsersResponseDto[] => {
  const response: GetUsersResponseDto[] = [new GetUsersResponseDto()];

  return response;
}