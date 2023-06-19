export class MenuService {
    async getMenu() {
        const result = await fetch('assets/demo/data/menu.json');
        const temp = result.json()
        // console.log(temp)

        return temp;
    }
}
