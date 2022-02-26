import React, { Fragment } from "react";
// import { useRouter } from "next/router";

import { getEventById, getFeaturedEvents } from "../../helpers/api-util";
import EventSummary from '../../components/event-detail/event-summary.component';
import EventLogistics from '../../components/event-detail/event-logistics.component';
import EventContent from "../../components/event-detail/event-content.component";
import ErrorAlert from "../../components/ui/error-alert.component";
import Button from "../../components/ui/button.component";

const EventDetailPage = (props) => {
    // const router = useRouter();
    // const eventId = router.query.eventId;
    // const event = getEventById(eventId);
    const event = props.selectedEvent;

    if (!event) {
        return (
            <Fragment>
                <ErrorAlert>
                    <p>Loading...</p>
                </ErrorAlert>
                <div className="center">
                    <Button link='/events'>Show All Events</Button>
                </div>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <EventSummary title={event.title}/>
            <EventLogistics 
                date={event.date}
                address={event.location}
                image={event.image}
                imageAlt={event.title}
            />
            <EventContent>
                <p>{event.description}</p>
            </EventContent>
        </Fragment>
    )
}

export const getStaticProps = async (context) => {
    const eventId = context.params.eventId;
    const event = await getEventById(eventId);

    return {
        props: {
            selectedEvent: event
        },
        revalidate: 30
    }
}

export const getStaticPaths = async () => {
    const allEvents = await getFeaturedEvents();
    const paths = allEvents.map(
        event => ({ params: { eventId: event.id } })
    );

    return {
        paths: paths,
        fallback: 'blocking' 
    };
} // fallback: true --> telling next.js that there are more pages than prepared (featured)

export default EventDetailPage;