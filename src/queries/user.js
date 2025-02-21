import { gql } from "@apollo/client";

export const GET_USER = gql`
	query GetUserData {
		getUserData {
			bookmarks {
				id
				name
				author
				authorName
				bodyPart
				description
				equipment
				preview
				video
			}
		}
	}
`;