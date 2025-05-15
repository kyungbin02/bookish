# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## 젠킨스 CI 설정

이 프로젝트는 젠킨스를 사용하여 사이프레스 테스트를 실행합니다.

### 사전 요구사항

- 젠킨스 서버 설치
- NodeJS 플러그인 설치

### 젠킨스 설정 방법

1. 젠킨스 관리 > Global Tool Configuration에서 NodeJS 설치 구성
   - 이름: `NodeJS`

2. 새 젠킨스 파이프라인 작업 생성
   - Pipeline 유형으로 작업 생성
   - SCM: Git 선택
   - Repository URL: 저장소 URL 입력
   - Script Path: `Jenkinsfile`

파이프라인은 다음 단계를 실행합니다:
- 코드 체크아웃
- 환경 정리
- 패키지 설치
- React 앱과 API 서버 실행
- 사이프레스 테스트 실행
