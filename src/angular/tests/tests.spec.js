import { createTestApp } from 'angularjs-jest';

describe('sla', () => {
    const getTestApp = () => createTestApp({
        modules: ['api'],
        mocks: { ProductService: ($q) => ProductServiceInstant($q) },
        access: ['ProductSummaryService'],
    })
    
    it('aaaaaa', () => {
        const app = getTestApp();

        // Access the $scope
        app.$scope.title = 'Some product';

        // Render, instead of $compile
        const element = app.render('<div>oi</div>');
        expect(element.text()).toContain('oi')
    })


})
