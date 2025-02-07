import { addMonths, set } from 'date-fns';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listproviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProvidersMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listproviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able show to list the month availability from provider', async () => {
    const today = new Date();
    const futureMonth = addMonths(today, 1); // Garante que está no futuro
    const year = futureMonth.getFullYear();
    const month = futureMonth.getMonth() + 1; // Meses começam de 0

    const day20 = set(futureMonth, { date: 20, hours: 9, minutes: 0 });
    const day21 = set(futureMonth, { date: 21, hours: 9, minutes: 0 });

    const appointments = Array.from({ length: 10 }, (_, index) =>
      fakeAppointmentsRepository.create({
        provider_id: 'user',
        user_id: 'user',
        date: set(day20, { hours: 9 + index }),
      }),
    );

    await Promise.all(appointments);

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: day21,
    });

    const availability = await listproviderMonthAvailability.execute({
      provider_id: 'user',
      year,
      month,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
      ]),
    );
  });
});
