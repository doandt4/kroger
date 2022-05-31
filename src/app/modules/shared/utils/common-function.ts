export class CommonFunction {
    constructor() {}

    getClassIcon1(name: string) {
        if (name) {
            switch (name.toLowerCase()) {
                case 'lounges':
                    return 'icon-couch';
                case 'cafes':
                    return 'icon-coffee';
                case 'airplanes':
                    return 'icon-plane';
                case 'malls':
                    return 'icon-malls';
                case 'villages':
                    return 'icon-vIllages';
                case 'buses':
                    return 'icon-bus';
                case 'cars':
                    return 'icon-car';
                case 'expo':
                    return 'assets/images/expo-icon.svg';
                default:
                    return 'icon-' + name.toLowerCase();
            }
        }
    }
}
